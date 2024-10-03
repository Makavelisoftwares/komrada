"use client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

export const LogOut = () => {
  return (
    <Button
      onClick={() =>
        signOut({ redirect: true, callbackUrl: `${window?.location?.origin}` })
      }
      className="flex items-center text-xs text-zinc-400 space-x-1"
      variant="ghost"
      size="sm"
    >
      <LogOutIcon />
      <div>Exit</div>
    </Button>
  );
};
