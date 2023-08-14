import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

import { Database, Json } from "../types_db";
import { Price, Product } from "../types";

import { stripe } from "./stripe";
import { toDateTime } from "./helpers";
import { metadata } from "../app/layout";

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

type BlockData = {
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

const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (error) throw error;
};

const manageCheckoutSessionStatusChange = async (
  checkoutSessionId: string,
  customerId: string,
  createAction = false
) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;
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

  const { error } = await supabaseAdmin
    .from("payments")
    .upsert([checkoutSessionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated checkoutSession [${checkoutSession.payment_intent}] for user [${uuid}]`
  );

  if (checkoutSession.status === "complete") {
    await insertBlocks(
      checkoutSession.payment_intent.toString(),
      uuid,
      checkoutSession.metadata as BlockData
    );
  }
};

const managePaymentStatusChange = async (
  paymentIntentId: string,
  customerId: string,
  createAction = false
) => {
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const paymentIntentData: Database["public"]["Tables"]["payments"]["Update"] =
    {
      payment_status: paymentIntent.status,
      amount_received: paymentIntent.amount_received,
    };

  const { error } = await supabaseAdmin
    .from("payments")
    .update(paymentIntentData)
    .eq("id", paymentIntent.id);
  if (error) throw error;
  console.log(`Updated paymentIntent [${paymentIntent.id}] for user [${uuid}]`);

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && payment.default_payment_method && uuid)
  //   //@ts-ignore
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     payment.default_payment_method as Stripe.PaymentMethod
  //   );

  if (paymentIntent.status === "succeeded") {
    await updateBlockStatus(paymentIntent.id, uuid);
  }
};

const insertBlocks = async (
  payment_id: string,
  uuid: string,
  blockData?: BlockData
) => {
  const { data } = await supabaseAdmin.from("block_groups").insert({}).select();

  let blockArray = [];
  if (metadata) {
    const { xAmount, yAmount, xStartBlock, yStartBlock } = blockData;
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

  const paymentIntentData = blockArray.map((block) => {
    const id = (parseInt(block.x) - 1) * 100 + parseInt(block.y);
    return {
      id: id,
      user_id: uuid,
      payment_id: payment_id,
      position: {
        x: block.x,
        y: block.y,
      },
      payment_status: "processing",
      group_id: data[0].id,
    };
  });

  console.log(paymentIntentData);

  const { error } = await supabaseAdmin
    .from("blocks")
    //@ts-ignore
    .upsert(paymentIntentData);

  if (error) throw error;
  console.log(`Inserted blocks for payment [${payment_id}] for user [${uuid}]`);
};

const updateBlockStatus = async (payment_id: string, uuid: string) => {
  try {
    const { data } = await supabaseAdmin
      .from("blocks")
      .select("*")
      .eq("payment_id", payment_id)
      .eq("user_id", uuid)
      .eq("payment_status", "processing");

    console.log(data);

    if (data.length > 0) {
      const updatedData = data.map((block) => {
        const updatedBlock = { ...block };
        updatedBlock.payment_status = "succeeded";
        return updatedBlock;
      });

      console.log(updatedData);

      await supabaseAdmin.from("blocks").upsert(updatedData);
    }

    console.log(
      `Updated blocks for payment [${payment_id}] for user [${uuid}]`
    );
  } catch (err) {
    if (err) throw err;
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  managePaymentStatusChange,
  manageCheckoutSessionStatusChange,
};
