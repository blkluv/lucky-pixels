import {
  createServerComponentClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Block } from "../types";

// const getBlocks = async (): Promise<Block[]> => {
const getSoldBlocks = async (id: number) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("block_groups")
    .select("*")
    .eq("payment_status", "succeeded")
    .order("position");

  if (error) {
    console.log(error.message);
  }
  return data[0] || [];
};

export default getSoldBlocks;
