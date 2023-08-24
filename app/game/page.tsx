"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Loading from "../loading/page";
import PageNotFound from "../pagenotfound/page";
import Lobby from "../lobby/page";
import Setup from "../setup/page";
import Identity from "../identity/page";
import { doGet, doPost } from "@/utils/apiutil";
import Vote from "../vote/page";
import Result from "../result/page";
import Spectator from "../spectator/page";
import { signOut, useSession } from "next-auth/react";

export default function Game() {
  const [joined, setJoined] = useState(false);
  const [screen, setScreen] = useState(<Loading />);

  const { data: session } = useSession();

  let socket: any = null;

  useEffect(() => {
    async function onMount() {
      await doGet("player");
      await doGet("game");
      await fetch("api/socket");
    }
    onMount();
  }, []);

  async function clientAttemptConnectionToServer() {
    if (socket === null) {
      socket = io(); // client attempts connection to server

      socket.on("connect", () => {
        console.log("client connected");
        setJoined(true);
      });

      socket.on("disconnect", () => {
        console.log(`socket (client) disconnected`);
        setJoined(false);
      });

      socket.on("data", (data: any) => {
        console.log(`socket(client) emitting ${data}`);
        console.log(
          `socket(client) emitting stringify ${JSON.stringify(data)}`
        );
        const screen = data["screen"];
        if (screen === "lobby") {
          setScreen(<Lobby {...data} />);
        } else if (screen === "setup") {
          setScreen(<Setup {...data} />);
        } else if (screen === "identity") {
          setScreen(<Identity {...data} />);
        } else if (screen === "vote") {
          setScreen(<Vote {...data} />);
        } else if (screen === "result") {
          setScreen(<Result {...data} />);
        } else if (screen === "spectator") {
          setScreen(<Spectator />);
        } else {
          setScreen(<PageNotFound />);
        }
      });
    } else {
    }
  }

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-800 text-white text-lg gap-1">
        {!session ? null : <div>Signed in as {session.user.name}</div>}
        <button
          onClick={() => signOut()}
          className="py-2 px-4 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-800"
        >
          Sign Out
        </button>
        <button
          onClick={() => {
            clientAttemptConnectionToServer();
          }}
          className="py-2 px-4 rounded-md bg-purple-500 hover:bg-purple-600 active:bg-purple-800"
        >
          JOIN GAME
        </button>
      </div>
    );
  } else {
    return <>{screen}</>;
  }
}
