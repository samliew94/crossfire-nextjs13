"use client";

import HardReset from "@/clientcomponents/hardreset";
import { doPost } from "@/utils/apiutil";
import React from "react";

export interface IVoteData {
  host: boolean;
  options: string[];
  selected: string;
  waitingFor: string[];
}

export default function Vote(vote: IVoteData) {
  const { host, options, selected, waitingFor } = vote;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-lg bg-neutral-800 text-white">
      {!host ? null : <HardReset host={host} />}
      <div className="text-2xl">Shoot A Player!</div>
      <div className="flex flex-col justify-center gap-1">
        {options?.map((username, i) => (
          <button
            onClick={() =>
              doPost("game/voteplayer", {
                username,
              })
            }
            className={`py-1 px-2 rounded-md ${
              selected && selected === username ? "bg-blue-500" : "bg-gray-500 "
            }`}
            key={i}
          >
            {username}
          </button>
        ))}
      </div>
      <br />
      <div>Waiting For:</div>
      <div className="flex flex-col justify-center items-center">
        {waitingFor?.map((x, i) => (
          <div key={i}>{x}</div>
        ))}
      </div>
    </div>
  );
}
