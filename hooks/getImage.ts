import { useSupabaseClient } from "@supabase/auth-helpers-react";

const getImage = (image) => {
  if (image) {
    const supabaseClient = useSupabaseClient();
    const { data: imageData } = supabaseClient.storage
      .from("images")
      .getPublicUrl(image);
    return imageData.publicUrl;
  }
  return null;
};

export default getImage;
