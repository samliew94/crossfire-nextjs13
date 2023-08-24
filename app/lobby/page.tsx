"use client";

import React from "react";
import { GiImperialCrown, GiBootKick } from "react-icons/gi";
import { BiSolidUpArrowCircle, BiSolidDownArrowCircle } from "react-icons/bi";
import { doPost } from "@/utils/apiutil";

export interface ILobby {
  host: boolean;
  players: {
    username: string;
    seat: number;
    host: boolean;
  }[];
}

export default function Lobby(lobby: ILobby) {
  if (!lobby) return null;

  const { host, players } = lobby;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-2 bg-neutral-800 text-white">
      <div className="text-4xl">LOBBY</div>
      <ul className="justify-center items-center">
        {players?.map((x, i) => (
          <li key={i} className="grid grid-cols-8 gap-1 text-2xl ">
            <div className="col-span-1">{i + 1}. &nbsp;</div>
            <div className="col-span-3">{x.username}</div>
            {x.host ? (
              <div className="pt-1 text-yellow-500">
                <GiImperialCrown />
              </div>
            ) : (
              <div></div>
            )}
            {host && !x.host ? (
              <button
                onClick={() => {
                  doPost("game/kick", {
                    username: x.username,
                  });
                }}
                className="pt-1 text-red-500"
              >
                <GiBootKick />
              </button>
            ) : (
              <div></div>
            )}
            {host && x.seat > 0 ? (
              <button
                onClick={() => {
                  doPost("player/move", {
                    username: x.username,
                    up: true,
                  });
                }}
                className="pt-1 text-green-500"
              >
                <BiSolidUpArrowCircle />
              </button>
            ) : (
              <div></div>
            )}
            {host && x.seat < players.length - 1 ? (
              <button
                onClick={() => {
                  doPost("player/move", {
                    username: x.username,
                    up: false,
                  });
                }}
                className="pt-1 text-red-500"
              >
                <BiSolidDownArrowCircle />
              </button>
            ) : (
              <div></div>
            )}
          </li>
        ))}
      </ul>

      {!host ? null : (
        <button
          onClick={() => doPost("game/tosetup")}
          className="rounded-md py-2 px-4 bg-purple-500 hover:bg-purple-600 active:bg-purple-800 text-white"
        >
          Next
        </button>
      )}
    </div>
  );
}
