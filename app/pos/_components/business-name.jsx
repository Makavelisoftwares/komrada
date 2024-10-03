"use client";

import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { toast } from "sonner";

export const BusinessName = ({ pos_business }) => {
  const handleShareLink = () => {
    window.navigator.clipboard.writeText(
      `${window?.location?.origin}/pos?id=${pos_business?.id}`
    );
    toast.success("link copied to clipboard");
  };

  return (
    <div className=" flex items-center justify-between ">
      <div className="text-md font-bold tracking-wider">
        POINT OF SALE(
        {pos_business?.name})
      </div>
      <div>
        <Button
          className="bg-zinc-400/50 text-white rounded-md hover:bg-zinc-400/50"
          onClick={handleShareLink}
          variant="ghost"
          size="sm"
        >
          <Share />
        </Button>
      </div>
    </div>
  );
};
