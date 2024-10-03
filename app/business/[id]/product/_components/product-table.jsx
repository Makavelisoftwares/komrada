"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductTable = ({ products }) => {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Table className="">
      <TableHeader className="border-b py-1 border-zinc-300/30">
        <TableHead>Product SNo.</TableHead>
        <TableHead>Product Name</TableHead>
        <TableHead>Product Quantity</TableHead>
        <TableHead>Product Cost price</TableHead>
        <TableHead>Product Selling Price</TableHead>

        <TableHead>Product Category</TableHead>
        <TableHead>Action</TableHead>
      </TableHeader>
      <TableBody>
        {products.map((item, i) => (
          <TableRow key={i} className={cn("",
            item?.quantity==0 && "bg-rose-300  ",
            item?.quantity==1 && "bg-amber-300"

          )}>
            <TableCell>{i + 1}</TableCell>
            <TableCell className="font-bold">{item?.name}</TableCell>

            <TableCell>{item?.quantity}</TableCell>
            <TableCell>{item?.costprice}</TableCell>
            <TableCell>{item?.sellprice}</TableCell>

            <TableCell>{item?.category?.name}</TableCell>

            <TableCell>
              <MoreVertical />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
