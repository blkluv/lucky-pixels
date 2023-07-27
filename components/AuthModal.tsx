"use client";

import { useEffect, useState } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { useUser } from "../hooks/useUser";
import usePlayer from "../hooks/usePlayer";
import { toast } from "react-hot-toast";

export const closeModal = () =>
  (document.getElementById("auth_modal") as HTMLFormElement)?.close();
export const showModal = () =>
  (document.getElementById("auth_modal") as HTMLFormElement)?.showModal();

function AuthModal() {
  const { session } = useSessionContext();
  const { user } = useUser();

  const player = usePlayer();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const [isMounted, setIsMounted] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();

    if (error) toast.error(error.message);
    else toast.success("Logged out");
  };

  useEffect(() => {
    if (session) {
      closeModal();
      session.expires_in == 3600 && toast.success("Logged in");
    }
  }, [session, router]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  } else
    return (
      <>
        <button
          className="btn absolute bottom-5 start-5 z-0"
          onClick={() => {
            if (!user) {
              showModal();
            } else handleLogout();
          }}
        >
          {user ? "Logout" : "Login"}
        </button>
        <dialog id="auth_modal" className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Hello!</h3>
            <Auth
              supabaseClient={supabaseClient}
              // supabaseClient={supabase}
              // onlyThirdPartyProviders={true}
              providers={["google"]}
              appearance={{
                theme: ThemeSupa,
              }}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
}

export default AuthModal;
