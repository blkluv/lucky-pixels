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

function GoogleModal() {
  const { session } = useSessionContext();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();

  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <>
      <button
        className="btn absolute bottom-5 start-5 z-0"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_1") as HTMLFormElement
            ).showModal();
          }
        }}
      >
        Google login
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
              // variables: {
              //   default: {
              //     colors: {
              //       brand: "#404040",
              //       brandAccent: "#22c55e",
              //     },
              //   },
              // },
            }}
            // theme="dark"
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
