"use client";

import { useEffect } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import useAuthModal from "../hooks/useAuthModal";
import { useUser } from "../hooks/useUser";
import usePlayer from "../hooks/usePlayer";
import { toast } from "react-hot-toast";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function GoogleModal() {
  const { session } = useSessionContext();
  const { user } = useUser();
  const { onClose } = useAuthModal();

  const player = usePlayer();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  console.log(user);

  useEffect(() => {
    if (session) {
      console.log(session.expires_in);
      session.expires_in == 3600 && toast.success("Logged in");
    }
  }, [session, router, onClose]);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();

    if (error) toast.error(error.message);
    else toast.success("Logged out");
  };

  return (
    <>
      <button
        className="btn absolute bottom-5 start-5 z-0"
        onClick={() => {
          if (document && !user) {
            (
              document.getElementById("my_modal_1") as HTMLFormElement
            ).showModal();
          } else handleLogout();
        }}
      >
        {user ? "Logout" : "Google login"}
      </button>
      <dialog id="my_modal_1" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <Auth
            supabaseClient={supabaseClient}
            // supabaseClient={supabase}
            onlyThirdPartyProviders={true}
            providers={["google"]}
            appearance={{
              theme: ThemeSupa,
            }}
          />
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default GoogleModal;
