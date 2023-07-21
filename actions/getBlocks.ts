import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
// import Cookies from 'js-cookie'

import { Block } from "../types";

const getBlocks = async (): Promise<Block[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabase.from("blocks").select("*").limit(10);
  console.log(data);

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getBlocks;
