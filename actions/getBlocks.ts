import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Block } from "../types";

const getBlocks = async (): Promise<Block[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase.from("blocks").select("*").limit(100);

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getBlocks;
