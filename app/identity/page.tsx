"use client";

import HardReset from "@/clientcomponents/hardreset";
import { doPost } from "@/utils/apiutil";
import React, { useEffect, useState } from "react";
import { AiFillEyeInvisible } from "react-icons/ai";

export interface IIdentity {
  screen: string;
  host: boolean;
  timeRemaining: number;
  roles: {
    code: string;
    num: number;
    team: number;
  }[];
  shuffles: {
    player: string;
    p1: string;
    p2: string;
  }[];
  firstDraw: string;
  secondDraw: {
    code: string;
    sender: string;
  };
  withs: {
    count: number;
    code: string;
    p1: string;
    p2: string;
  }[];
}

export default function Identity(identity: IIdentity) {
  const { host, timeRemaining, roles, shuffles, firstDraw, secondDraw, withs } =
    identity;

  const [visibleIds, setVisibleIds] = useState(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState(
    timeRemaining ?? 300
  );

  const { code, sender } = secondDraw || {};

  useEffect(() => {
    const interval = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [secondsRemaining]);

  function getTextStyleByCode(code: string) {
    if (code === "VIP" || code === "AGENT" || code === "BLUE DECOY")
      return "text-blue-500";
    else if (code === "ASSASSIN" || code === "RED DECOY") return "text-red-500";
    else if (code === "DECOY" || code === "BOMBER") return "text-orange-500";

    return "";
  }

  function getRoles() {
    return (
      <div className="flex flex-col bg-black-500 col-span-2">
        {roles?.map(({ code, num }, i) => {
          return (
            <div
              key={i}
              className={`flex flex-col justify-center items-center grid grid-cols-2 text-center ${getTextStyleByCode(
                code
              )}`}
            >
              <div>{code}</div>
              <div>x {num}</div>
            </div>
          );
        })}
      </div>
    );
  }

  function getShuffles() {
    function bold(p: string) {
      return <span className="font-bold">{p}</span>;
    }

    return (
      <div className="flex flex-col justify-center text-center col-span-3">
        <div className="mb-1">Shuffles:</div>
        {shuffles?.map(({ player, p1, p2 }, i) => {
          return (
            <div
              key={i}
              className="p-1 border border-dashed bg-neutral-700 rounded-md mb-1"
            >
              {bold(p1)} {bold(player)} {bold(p2)}
            </div>
          );
        })}
      </div>
    );
  }

  function getRevealStyle(code: string) {
    if (code === "VIP" || code === "AGENT" || code === "BLUE DECOY")
      return "bg-blue-500";
    else if (code === "ASSASSIN" || code === "RED DECOY") return "bg-red-500";
    else if (code === "DECOY" || code === "BOMBER") return "bg-orange-500";

    return "";
  }

  function showHideRoleCode(id: number, code: string) {
    return (
      <button
        onClick={() => {
          if (visibleIds.has(id)) {
            setVisibleIds((prev) => {
              prev.delete(id);
              return new Set(prev);
            });
          } else {
            setVisibleIds((prev) => new Set(prev.add(id)));
          }
        }}
        className={`rounded-md px-2 py-0.5 text-white text-2xl ${
          visibleIds.has(id) ? getRevealStyle(code) : "bg-gray-500"
        }`}
      >
        {visibleIds.has(id) ? code : <AiFillEyeInvisible />}
      </button>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-1 text-lg text-white bg-neutral-800">
      {!host ? null : <HardReset host={host} />}
      <div className="grid grid-cols-5 mx-1 border border-dashed p-1 rounded-md mb-4">
        {getRoles()}
        {getShuffles()}
      </div>
      <div>Time Remaining: {secondsRemaining}s</div>
      <div>You first saw:</div>
      {showHideRoleCode(0, firstDraw)}
      {/* {visibleIds.has(0) ? deleteMe(0, firstDraw) : addMe(0, firstDraw)} */}
      <br />
      <div>
        <span className="font-bold">{sender}</span> saw and gave you:
      </div>
      {showHideRoleCode(1, code)}
      <br />
      {withs?.map(({ count, code, p1, p2 }, i) => {
        return (
          <div key={i} className="flex flex-col justify-center items-center">
            <div key={i}>
              Shuffled with <span className="font-bold">{p1}</span> and{" "}
              <span className="font-bold">{p2}</span> and got:
            </div>
            {showHideRoleCode(count, code)}
            <br />
          </div>
        );
      })}
      {!host ? null : (
        <button
          onClick={() => doPost("game/tovote")}
          className="rounded-md py-2 px-4 bg-purple-500 hover:bg-purple-600 active:bg-purple-800 text-white "
        >
          Skip to Vote
        </button>
      )}
    </div>
  );
}
