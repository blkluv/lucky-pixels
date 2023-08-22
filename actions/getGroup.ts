import {
  createServerComponentClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

// const getGroupBlocks = async (id: number) => {
//   const supabase = createClientComponentClient();

//   const { data, error } = await supabase
//     .from("block_groups")
//     .select("*")
//     .eq("id", id)
//     .single();
//   if (error) {
//     console.log(error.message);
//   }
//   const { data: blockData, error: blockError } = await supabase
//     .from("block")
//     .select("*")
//     .eq("id", id)
//     .single();
//   if (error) {
//     console.log(error.message);
//   }
//   return (data as any) || [];
// };

const getBlockGroup = async (id: number) => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("block_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error.message);
  }
  return (data as any) || [];
};

export { getBlockGroup };
