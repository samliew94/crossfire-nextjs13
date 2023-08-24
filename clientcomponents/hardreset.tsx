"use client";

import { doPost } from "@/utils/apiutil";
import React from "react";

export interface IHardResetData {
  host: boolean;
}

export default function HardReset(data: IHardResetData) {
  if (!data) return null;

  const { host } = data;

  if (!host) return null;

  return (
    <button
      onClick={() => {
        doPost("game/restart");
      }}
      className="py-1 px-2 rounded-md bg-red-500 text-white text-lg"
    >
      Hard Reset
    </button>
  );
}
