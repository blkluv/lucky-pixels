import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { Database, Json } from "../types_db";
import { Price, Product, Payment } from "../types";

import { stripe } from "./stripe";
import { toDateTime } from "./helpers";
import { metadata } from "../app/layout";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

type MetaData = {
  xAmount: string;
  yAmount: string;
  xStartBlock: string;
  yStartBlock: string;
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();
  if (error || !data?.stripe_customer_id) {
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      {
        metadata: {
          supabaseUUID: uuid,
        },
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([{ id: uuid, stripe_customer_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);
    return customer.id;
  }
  return data.stripe_customer_id;
};

const managePayment = async (
  sessionId: string,
  customerId: string,
  webhookType: string
) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  let paymentData;
  if (webhookType === "checkout")
    paymentData = await manageCheckoutSession(sessionId, uuid);
  else if (webhookType === "payment_intent")
    paymentData = await managePaymentIntent(sessionId, uuid);

  if (paymentData.checkout_status === "complete" && paymentData.metadata)
    await insertBlocks(paymentData, uuid, paymentData.metadata as MetaData);
  if (
    paymentData.checkout_status === "complete" &&
    paymentData.payment_status === "succeeded"
  )
    await updateBlocks(paymentData, uuid);
};

const manageCheckoutSession = async (
  checkoutSessionId: string,
  uuid: string
) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    checkoutSessionId
  );

  const checkoutSessionData: Database["public"]["Tables"]["payments"]["Insert"] =
    {
      id: checkoutSession.payment_intent.toString(),
      checkout_status: checkoutSession.status,
      created: toDateTime(checkoutSession.created).toISOString(),
      user_id: uuid,
      metadata: checkoutSession.metadata,
      amount: checkoutSession.amount_total,
    };

  const { data, error } = await supabaseAdmin
    .from("payments")
    .upsert([checkoutSessionData])
    .select();
  if (error) throw error;

  console.log(
    `Upsert checkoutSession [${checkoutSession.payment_intent}] for user [${uuid}]`
  );

  if (data.length > 0) return data[0];
  else return null;
};

const managePaymentIntent = async (paymentIntentId: string, uuid: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const paymentIntentData: Database["public"]["Tables"]["payments"]["Insert"] =
    {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      payment_status: paymentIntent.status,
      user_id: uuid,
      amount_received: paymentIntent.amount_received,
    };

  const { data, error } = await supabaseAdmin
    .from("payments")
    .upsert(paymentIntentData)
    .select();
  if (error) throw error;

  console.log(`Upsert paymentIntent [${paymentIntent.id}] for user [${uuid}]`);

  if (data.length > 0) return data[0];
  else return null;
};

const insertBlocks = async (
  payment: Payment,
  uuid: string,
  metaData?: MetaData
) => {
  // const { data: blocks } = await supabaseAdmin
  //   .from("blocks")
  //   .select("*")
  //   .eq("payment_id", payment.id);

  // console.log(blocks.length);
  // if (blocks.length > 0) {
  //   return null;
  // }

  // const { data: groupData, error: groupError } = await supabaseAdmin
  //   .from("block_groups")
  //   .insert({})
  //   .select();

  // if (groupError) throw groupError;
  // console.log(
  //   `Inserted block_group for payment [${groupData[0].id}] for user [${uuid}]`
  // );

  let blockArray = [];
  if (metadata) {
    const { xAmount, yAmount, xStartBlock, yStartBlock } = metaData;
    for (let i = 0; i < parseInt(xAmount); i++) {
      blockArray.push(
        ...[...Array(parseInt(yAmount))].map((y, j) => {
          return {
            x: +xStartBlock + j,
            y: +yStartBlock + i,
          };
        })
      );
    }
  }

  const blockData = blockArray?.map((block) => {
    const id = (parseInt(block.x) - 1) * 100 + parseInt(block.y);
    return {
      id: id,
      user_id: uuid,
      payment_id: payment.id,
      position: {
        x: block.x,
        y: block.y,
      },
      payment_status: "processing",
      // group_id: groupData[0].id,
    };
  });

  const { error } = await supabaseAdmin
    .from("blocks")
    //@ts-ignore
    .upsert(blockData);

  if (error) throw error;
  console.log(`Inserted blocks for payment [${payment.id}] for user [${uuid}]`);
};

const updateBlocks = async (payment: Payment, uuid: string) => {
  try {
    const { data } = await supabaseAdmin
      .from("blocks")
      .select("*")
      .eq("payment_id", payment.id)
      .eq("user_id", uuid)
      .eq("payment_status", "processing");

    if (data.length > 0) {
      const updatedData = data.map((block) => {
        const updatedBlock = { ...block };
        updatedBlock.payment_status = "succeeded";
        return updatedBlock;
      });

      await supabaseAdmin.from("blocks").upsert(updatedData);
    }

    console.log(
      `Updated blocks for payment [${payment.id}] for user [${uuid}]`
    );
  } catch (err) {
    if (err) throw err;
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  managePayment,
};
