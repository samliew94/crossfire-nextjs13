"use client";

import { doPost } from "@/utils/apiutil";
import React from "react";
import { FaGun } from "react-icons/fa6";

/** must be sorted by win condition */
export interface IResultData {
  host: boolean;
  winnersAndLosers: {
    win: boolean;
    code: string;
    player: string;
  }[];
  eventLogs: {
    shooter: string;
    shooterCode: string;
    target: string;
    targetCode: string;
  }[];
}
export default function Result(data: IResultData) {
  const { host, winnersAndLosers, eventLogs } = data;

  function drawWinnersAndLosers() {
    return (
      <div>
        {winnersAndLosers?.map(({ win, code, player }, i) => {
          // const bgStyle = styleByCode(code)

          return (
            <div
              key={i}
              className="grid grid-cols-3 gap-1 text-center mb-1 text-lg mx-4"
            >
              <div
                className={`${win ? "bg-green-500" : "bg-red-500"} rounded-md`}
              >
                {win ? "WIN" : "LOSE"}
              </div>
              <div className={`${styleByCode(code)}`}>{code}</div>
              <div className="">{player}</div>
            </div>
          );
        })}
        <br />
        {eventLogs?.map(({ shooter, shooterCode, target, targetCode }, i) => {
          return (
            <div
              key={i}
              className={`grid grid-cols-5 gap-1 flex flex-col justify-center items-center text-center py-1 px-1 ${
                i % 2 === 0 ? "bg-gray-400" : "bg-gray-500"
              }`}
            >
              <div>{shooter}</div>
              <div className={`${styleByCode(shooterCode)}`}>{shooterCode}</div>
              <div className="flex flex-col items-center text-2xl">
                <FaGun />
              </div>
              <div>{target}</div>
              <div className={`${styleByCode(targetCode)}`}>{targetCode}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-800 text-white">
      {drawWinnersAndLosers()}
      <br />
      {!host ? null : (
        <button
          onClick={() => doPost("game/restart")}
          className="text-lg py-2 px-4 rounded-md bg-purple-500 hover:bg-purple-600 active:bg-purple-800"
        >
          Restart
        </button>
      )}
    </div>
  );
}

function styleByCode(code: string) {
  const styleCode =
    code === "VIP" || code === "AGENT" || code === "BLUE DECOY"
      ? "bg-blue-500"
      : code === "ASSASSIN" || code === "RED DECOY"
      ? "bg-red-500"
      : code === "DECOY" || code === "BOMBER"
      ? "bg-orange-500"
      : "";

  return " px-1 rounded-md " + styleCode;
}
