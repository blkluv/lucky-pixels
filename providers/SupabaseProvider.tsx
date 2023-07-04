"use client";

import { Children, useState } from "react";
import { Database } from "../types_db";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SupabaseProvidersProps {
  children: React.ReactNode;
}

function SupabaseProviders({ children }: SupabaseProvidersProps) {
  const [supabaseClient] = useState(() => {
    createClientComponentClient<Database>();
  });

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
}

export default SupabaseProviders;