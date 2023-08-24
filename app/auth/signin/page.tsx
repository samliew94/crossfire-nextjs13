"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

export default function SignIn() {
  const [username, setUsername] = useState("");

  function randomWord(): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let word: string = "";
    for (let i = 0; i < 4; i++) {
      word += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return word;
  }

  function onUsernameChange(e: any) {
    const sanitizedInput = e.target.value.replace(/[^A-Za-z0-9]/g, ""); // Remove characters other than alphabets and numbers
    const truncatedInput = sanitizedInput.slice(0, 8); // Limit to 6 characters
    setUsername(truncatedInput.toUpperCase());
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-2xl gap-1 bg-neutral-800">
      <img
        className="rounded-md"
        src="https://cf.geekdo-images.com/6bX0JWyEXFx7mXt_mCfiOw__itemrep/img/quhSIThFTLnIzVVFCNlJ6mX8URE=/fit-in/246x300/filters:strip_icc()/pic3621676.jpg"
      ></img>
      <input
        placeholder="Enter Username"
        className="text-center border border-black rounded-md py-2 px-4"
        onChange={onUsernameChange}
        value={username}
        name="username"
      />
      <button
        onClick={async () => {
          if (!username || username.length < 1) return;

          await signIn("credentials", {
            username: username,
            redirect: true,
            callbackUrl: "/",
          });
        }}
        className="rounded-md py-2 px-4 text-white bg-purple-500 hover:bg-purple-600 active:bg-purple-800"
      >
        Next
      </button>
      <div className="text-sm text-white italic mt-4">
        NextJS 13, Tailwind, Socket.io v4 & NextAuth 4
      </div>
    </div>
  );
}
