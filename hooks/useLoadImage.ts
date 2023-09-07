import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (imageUrl) => {
  if (imageUrl) {
    const supabaseClient = useSupabaseClient();
    const { data: imageData } = supabaseClient.storage
      .from("images")
      .getPublicUrl(imageUrl);
    return imageData.publicUrl;
  }
  return null;
};

export default useLoadImage;
