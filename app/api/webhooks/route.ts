import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../libs/stripe";
import {
  upsertProductRecord,
  upsertPriceRecord,
  managePaymentStatusChange,
  manageCheckoutSessionStatusChange,
} from "../../../libs/supabaseAdmin";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "payment_intent.created",
  "payment_intent.succeeded",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("Stripe-Signature");

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      console.log(`Webhook event ${event.type}`);
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "payment_intent.created":
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await managePaymentStatusChange(
            paymentIntent.id,
            paymentIntent.customer as string,
            true
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          await manageCheckoutSessionStatusChange(
            checkoutSession.id,
            checkoutSession.customer as string,
            true
          );
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new NextResponse(
        'Webhook error: "Webhook handler failed. View logs."',
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
