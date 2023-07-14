"use client";

import React, { useEffect } from "react";
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

function GoogleModal() {
  const player = usePlayer();
  const { session } = useSessionContext();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  useEffect(() => {
    if (session) {
      toast.success("Logged in");
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    player.reset();
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else toast.success("Logged out");
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
            providers={["google"]}
            magicLink={true}
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
