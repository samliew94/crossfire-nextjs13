"use client";

import { SessionProvider } from "next-auth/react";

interface IProps {
  children: React.ReactNode;
}

export default function SessionProviderWrapper(children: IProps) {
  return (
    <div>
      <SessionProvider>{children.children}</SessionProvider>
    </div>
  );
}
