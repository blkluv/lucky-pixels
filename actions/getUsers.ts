import {
  createServerComponentClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

const supabase = createClientComponentClient();
const getUser = async (id) => {
  const { data, error } = await supabase.auth.admin.getUserById(id);

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

const getUsers = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export { getUser, getUsers };
