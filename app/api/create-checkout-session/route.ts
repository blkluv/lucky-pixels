import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "../../../libs/stripe";
import { getURL } from "../../../libs/helpers";
import { createOrRetrieveCustomer } from "../../../libs/supabaseAdmin";

export async function POST(request: Request) {
  const { price, quantity, blockAmounts } = await request.json();

  try {
    const supabase = createRouteHandlerClient({
      cookies,
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || "",
      email: user?.email || "",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      metadata: blockAmounts,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${getURL()}/?checkout=success`,
      cancel_url: `${getURL()}/?checkout=cancel`,
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
