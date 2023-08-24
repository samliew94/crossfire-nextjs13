import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-800 text-white text-lg">
      <div>Checking Authentication...</div>
      <div>Please Wait...</div>
    </div>
  );
}
