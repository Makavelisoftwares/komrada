"use client";
import * as React from "react";
import { Check, CheckCircle2, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BusinessNameCombobox({ Data }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isMounted, setisMounted] = useState(false);
  const [currentStore, setcurrentStore] = useState({});

  const path = usePathname();
  const id = path ? path.split("/")[2] : null;

  useEffect(() => {
    setisMounted(true);
  }, []);

  useEffect(() => {
    if (id && Data) {
      const new_currentStore = Data.find((item) => item?.id == id);
      setcurrentStore(new_currentStore);
    }
  }, [Data, id]);

  if (!isMounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {currentStore.id && (
          <Button
            className="w-[250px] flex items-center justify-between"
            variant="outlined"
          >
            <span className="font-bold text-sm">{currentStore?.name}</span>
            <ChevronsUpDown className="w-[20px] h-[20px] text-zinc-500" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel>My Businesses</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div>
        <ScrollArea className="h-[150px]">
          {Data.map((it, i) => (
            <DropdownMenuItem
              className={cn(
                "",
                path == `/business/${it?.id}` &&
                  "text-sky-500 bg-sky-100 hover:bg-sky-100 hover:text-sky-500"
              )}
              key={i}
            >
              <Link
                className="flex p-1 items-center space-x-2"
                disabled={path == `/business/${it.id}`}
                href={
                  path !== `/business/${it?.id}` ? `/business/${it?.id}` : "#"
                }
              >
                <Check
                  className={cn("", path !== `/business/${it?.id}` && "hidden")}
                />
                <span>{it?.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          </ScrollArea>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link className="flex items-center space-x-2" href={"/new-company"}>
              <PlusCircle />
              <span>create business</span>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
