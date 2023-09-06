import Stripe from "stripe";
import { Database, Json } from "./types_db";

type Position = {
  x: number;
  y: number;
};

export type Payment = {
  amount: number;
  amount_received: number | null;
  checkout_status: Database["public"]["Enums"]["checkout_status"] | null;
  created: string;
  id: string;
  metadata: Json | null;
  payment_status: Database["public"]["Enums"]["payment_status"] | null;
  user_id: string;
};

export type Block = {
  created_at: string | null;
  id: number;
  image_url: string | null;
  payment_id: string;
  payment_status: Database["public"]["Enums"]["payment_status"] | null;
  position: Position | null;
  user_id: string | null;
};

export type Image = {
  id: string;
  created_at: string;
  image_link: string;
};

export type Product = {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
};

export type Price = {
  id: string;
  product_id?: string;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
};

export type Customer = {
  id: string;
  stripe_customer_id?: string;
};

export type UserDetails = {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
};

export type ProductWithPrice = Product & {
  prices?: Price[];
};
