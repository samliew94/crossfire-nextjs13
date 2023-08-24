"use client";

import { useSession } from "next-auth/react";
import React from "react";
import Loading from "./loading/page";
import SignIn from "./auth/signin/page";
import Game from "./game/page";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  } else if (status === "unauthenticated") {
    return <SignIn />;
  } else {
    return <Game />; // authenticated
  }
}
