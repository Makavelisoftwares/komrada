"use client";

import {
  Box,
  CheckCircle2,
  Computer,
  HomeIcon,
  LayoutDashboard,
  UserCircleIcon,
  WalletIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
export const SideBar = () => {
  const path = usePathname();
  const b_id = path.split("/")[2];

  const links = [
    {
      name: "Overview",
      href: `/business/${b_id}`,
      icon: <HomeIcon />,
    },

    {
      name: "Products",
      href: `/business/${b_id}/product`,
      icon: <Box />,
    },
    {
      name: "Categories",
      href: `/business/${b_id}/category`,
      icon: <LayoutDashboard />,
    },
    {
      name: "suppliers",
      href: `/business/${b_id}/supplier`,
      icon: <UserCircleIcon />,
    },
    {
      name: "Orders",
      href: `/business/${b_id}/order`,
      icon: <CheckCircle2 />,
    },
    {
      name: "Payments",
      href: `/business/${b_id}/payment`,
      icon: <WalletIcon />,
    },

    {
      name: "Pos",
      href: `/pos?id=${b_id}`,
      icon: <Computer />,
    },
  ];
  return (
    <div>
      <div className="space-y-2">
        {links.map((item, i) => (
          <Button
            className="w-full flex justify-start py-2"
            asChild
            variant="ghost"
            size="sm"
            key={i}
          >
            <Link
              className={cn(
                "flex items-center space-x-2 py-2",
                path == item?.href &&
                  "bg-sky-200/50 text-sky-700 hover:text-sky-700 rounded-sm"
              )}
              href={item?.href}
              // target={item?.href.includes("/pos") && "_blank"}
            >
              <div
                className={cn(
                  "",
                  path == item?.href && "animate-spin repeat-1 duration-1000"
                )}
              >
                {item?.icon}
              </div>
              <div>{item?.name}</div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
