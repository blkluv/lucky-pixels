import { User } from "@supabase/auth-helpers-nextjs";
import { Subscription, UserDetails } from "../types";
import { createContext, useEffect, useState } from "react";
import {
  useSessionContext,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";

type UserContexType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContexType | undefined>(undefined);

export interface Props {
  [propname: string]: any;
}

export function MyUserContextProvider(props: Props) {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>();
  const [subscription, setSubscription] = useState<Subscription | null>();

  const getUserDetails = () => supabase.from("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*, prices(*, products(*))")
      .in("status", ["trailing, active"])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then((res) => {
        const userDetailPromise = res[0];
        const subscriptionPromise = res[1];
        if (userDetailPromise.status === "fulfilled") {
          setUserDetails(userDetailPromise.value.data as UserDetails);
        }
        if (subscriptionPromise.status === "fulfilled") {
          setSubscription(subscriptionPromise.value.data as Subscription);
        }
      });
    } else if (!user && !isLoadingData && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);
}
