import Stripe from "stripe";
import { Database, Json } from "./types_db";

interface Position {
  x: number;
  y: number;
}

export interface Payment {
  amount: number;
  amount_received: number | null;
  checkout_status: Database["public"]["Enums"]["checkout_status"] | null;
  created: string;
  id: string;
  metadata: Json | null;
  payment_status: Database["public"]["Enums"]["payment_status"] | null;
  user_id: string;
}

export interface Block {
  created_at: string | null;
  id: number;
  image_url: string | null;
  payment_id: string;
  payment_status: Database["public"]["Enums"]["payment_status"] | null;
  position: Position | null;
  user_id: string | null;
}

export interface Image {
  id: string;
  created_at: string;
  image_link: string;
}

export interface Product {
  id: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface Price {
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
}

export interface Customer {
  id: string;
  stripe_customer_id?: string;
}

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}
