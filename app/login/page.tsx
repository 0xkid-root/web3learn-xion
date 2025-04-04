"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const { data: { bech32Address }, isConnected, isConnecting } = useAbstraxionAccount();
  const [, setShow] = useModal();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard"); // Redirect to dashboard after login
    }
  }, [isConnected]); // Added isConnected as a dependency

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-500 p-6 text-white">
      {
        bech32Address && (
          <div className="mb-4 border-2 border-primary rounded-md p-4 flex flex-row gap-4">
            <div className="flex flex-row gap-6">
              <div>Address:</div>
              <div>{bech32Address}</div>
            </div>
          </div>
        )
      }
      <div className="w-full max-w-md rounded-lg bg-white bg-opacity-10 p-8 shadow-lg backdrop-blur-md">
        <h1 className="mb-4 text-3xl font-bold text-center text-white">Unlock Your Future with LearnChain</h1>
        <p className="mb-6 text-center text-gray-200">
          Join a decentralized learning revolution! Empowering students with transparent, blockchain-backed funding for a smarter tomorrow.
        </p>
        <Button
          fullWidth
          onClick={() => { setShow(true) }}
          structure="base"
        >
          {bech32Address ? (
            <div className="flex items-center justify-center">VIEW YOUR ACCOUNT</div>
          ) : (
            "CONNECT TO START YOUR JOURNEY"
          )}
        </Button>
        
        <Abstraxion onClose={() => setShow(false)} />
      </div>
    </main>
  );
}
