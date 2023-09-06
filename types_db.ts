export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      block_groups: {
        Row: {
          created_at: string;
          desc: string | null;
          id: number;
          image: string | null;
          link: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          desc?: string | null;
          id?: number;
          image?: string | null;
          link?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          desc?: string | null;
          id?: number;
          image?: string | null;
          link?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      blocks: {
        Row: {
          created_at: string | null;
          group_id: number | null;
          id: number;
          image: string | null;
          payment_id: string;
          payment_status: Database["public"]["Enums"]["payment_status"] | null;
          position: Json | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          group_id?: number | null;
          id?: number;
          image?: string | null;
          payment_id: string;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          position?: Json | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          group_id?: number | null;
          id?: number;
          image?: string | null;
          payment_id?: string;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          position?: Json | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blocks_group_id_fkey";
            columns: ["group_id"];
            referencedRelation: "block_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocks_payment_id_fkey";
            columns: ["payment_id"];
            referencedRelation: "payments";
            referencedColumns: ["id"];
          }
        ];
      };
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          amount: number;
          amount_received: number | null;
          checkout_status:
            | Database["public"]["Enums"]["checkout_status"]
            | null;
          created: string;
          id: string;
          metadata: Json | null;
          payment_status: Database["public"]["Enums"]["payment_status"] | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          amount_received?: number | null;
          checkout_status?:
            | Database["public"]["Enums"]["checkout_status"]
            | null;
          created?: string;
          id: string;
          metadata?: Json | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          amount_received?: number | null;
          checkout_status?:
            | Database["public"]["Enums"]["checkout_status"]
            | null;
          created?: string;
          id?: string;
          metadata?: Json | null;
          payment_status?: Database["public"]["Enums"]["payment_status"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          billing_address: Json | null;
          full_name: string | null;
          id: string;
          payment_method: Json | null;
        };
        Insert: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id: string;
          payment_method?: Json | null;
        };
        Update: {
          avatar_url?: string | null;
          billing_address?: Json | null;
          full_name?: string | null;
          id?: string;
          payment_method?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      checkout_status: "open" | "complete" | "expired";
      payment_satatus:
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "processing"
        | "requires_capture"
        | "canceled"
        | "succeeded";
      payment_status:
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "processing"
        | "requires_capture"
        | "canceled"
        | "succeeded";
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
