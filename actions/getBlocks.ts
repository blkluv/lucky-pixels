import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Block } from "../types";

const getBlocks = async (): Promise<Block[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase
    .from("blocks")
    .select("user_id, image_url, position")
    .eq("payment_status", "succeeded");

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getBlocks;
