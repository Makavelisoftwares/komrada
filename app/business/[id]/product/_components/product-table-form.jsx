"use client";

import { Button } from "@/components/ui/button";
import { handleShowTableAndForm } from "@/lib/change-element";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

export const ProductTableAndForm = () => {
  const [display, setDisplay] = useState("table_display");

  const handleShow = (form, table) => {
    const element = handleShowTableAndForm(form, table);
    setDisplay(element);
  };

  return (
    <div>
      <div
        className="flex items-center justify-end"
        onClick={() => handleShow(".product-form", ".product-table")}
      >
        {display == "table_display" ? (
          <Button
            size="sm"
            className="bg-rose-500 text-white hover:bg-rose-500 flex items-center space-x-2"
          >
            <PlusCircle />
            <div>create product</div>
          </Button>
        ) : (
          <div className="w-[50px] h-[50px] cursor-pointer flex items-center justify-center border border-zinc-200">
            <X />
          </div>
        )}
      </div>
    </div>
  );
};
