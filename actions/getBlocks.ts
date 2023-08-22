import {
  createServerComponentClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Block } from "../types";

const keyValueJson = (data: any) => {
  const keyData = [];
  if (data.length > 0) {
    for (const block of data) {
      keyData[block.id] = block;
    }
    keyData[0] = data;
  }
  return keyData;
};

const getSoldBlocks = async () => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("payment_status", "succeeded")
    .order("position");

  if (error) {
    console.log(error.message);
  }

  return (keyValueJson(data) as any) || [];
};

const getUserBlocks = async (id) => {
  if (id) {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase
      .from("blocks")
      .select("*")
      .eq("payment_status", "succeeded")
      .eq("user_id", id)
      .order("id");

    if (error) {
      console.log(error.message);
    }

    return (keyValueJson(data) as any) || [];
  }
  return [];
};

export { getSoldBlocks, getUserBlocks };
