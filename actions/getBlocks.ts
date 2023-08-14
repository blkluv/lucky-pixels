import {
  createServerComponentClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Block } from "../types";

// const getBlocks = async (): Promise<Block[]> => {
const getSoldBlocks = async () => {
  const supabase = createClientComponentClient();
  // const supabase = createServerComponentClient({
  //   cookies: cookies,
  // });

  const { data, error } = await supabase
    .from("blocks")
    .select("*")
    .eq("payment_status", "succeeded")
    .order("position");

  if (error) {
    console.log(error.message);
  }

  const keyData = [];
  for (const block of data) {
    keyData[block.id] = block;
  }
  keyData[0] = data;

  return (keyData as any) || [];
};

export default getSoldBlocks;
