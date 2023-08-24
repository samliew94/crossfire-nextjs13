"use client";

import HardReset from "@/clientcomponents/hardreset";
import { winCondition } from "@/gamedata/setup";
import { doPost } from "@/utils/apiutil";
import React from "react";

export interface ISetup {
  host: boolean; // is this the host?
  selectedOption: number; // what is the selected setup element id?
  options: {
    numPlayers: number;
    sniperMode: boolean;
    roles: {
      code: string;
      num: number;
      team: number;
    }[];
  }[];
}

export default function Setup(data: ISetup) {
  const { host, selectedOption, options } = data;

  function getOption(option: any) {
    const { roles } = option;
    return (
      <div className="flex flex-col">
        {roles?.map((x: any, i: number) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-1 justify-center items-center"
          >
            <div
              className={`${
                x.team === 0
                  ? "text-blue-500"
                  : x.team === 1
                  ? "text-red-500"
                  : "text-orange-500"
              }`}
            >
              {x.code}
            </div>
            <div>x {x.num}</div>
          </div>
        ))}
      </div>
    );
  }

  function winConditions() {
    return (
      <div>
        <div className="mt-4 text-2xl">How to Win:</div>
        <div className="text-sm">
          {!options
            ? null
            : options[selectedOption]?.roles?.map((role, i) => {
                const code = role.code;

                const bgStyle =
                  code === "VIP" || code === "AGENT" || code === "BLUE DECOY"
                    ? "bg-blue-500 text-white"
                    : code === "ASSASSIN" || code === "RED DECOY"
                    ? "bg-red-500 text-black"
                    : code === "DECOY" || code === "BOMBER"
                    ? "bg-orange-500 text-white"
                    : "";

                const overrallStyle = "rounded-md mb-1 p-1 " + bgStyle;

                return (
                  <div key={i} className="text-center justify-center ">
                    <div className={`${overrallStyle}`}>
                      <div className="">{code}</div>
                      <div className="">
                        {code === "VIP"
                          ? winCondition.vip
                          : code === "AGENT"
                          ? winCondition.agent
                          : code === "ASSASSIN"
                          ? winCondition.assassin
                          : code === "DECOY"
                          ? winCondition.decoy
                          : code === "BLUE DECOY"
                          ? winCondition.blueDecoy
                          : code === "RED DECOY"
                          ? winCondition.redDecoy
                          : code === "BOMBER"
                          ? winCondition.bomber
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-1 text-white text-center px-1 bg-neutral-800">
      <HardReset {...data} />
      {options?.map((x, i) => (
        <button
          key={i}
          onClick={() => {
            if (selectedOption === i) return;
            doPost("game/updateselectedoption", {
              selectedOption: i,
            });
          }}
          className={`rounded-md py-2 px-4 ${
            selectedOption === i ? "bg-purple-800" : "bg-gray-600"
          }`}
        >
          {getOption(x)}
        </button>
      ))}
      {winConditions()}
      {!host ? null : (
        <button
          onClick={() => doPost("game/start")}
          className="text-white py-2 px-4 rounded-md bg-purple-500 hover:bg-purple-600 active:bg-purple-800"
        >
          Next
        </button>
      )}
    </div>
  );
}
