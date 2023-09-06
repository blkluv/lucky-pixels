"use client";

import { MyUserContextProvider } from "../hooks/useUser";

type UserProviderProps = {
  children: React.ReactNode;
};

function UserProvider({ children }: UserProviderProps) {
  return <MyUserContextProvider>{children}</MyUserContextProvider>;
}

export default UserProvider;
