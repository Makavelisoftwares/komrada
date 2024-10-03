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
import moment from "moment";
import { useEffect, useState } from "react";

export const TodayPaymentTable = ({ filterTodayPayments }) => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Table>
      <TableHeader>
        <TableHead>invoice</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Type</TableHead>

        <TableHead>Time</TableHead>
      </TableHeader>
      <TableBody>
        {filterTodayPayments.map((item, i) => (
          <TableRow key={i}>
            <TableCell className="font-bold">#{item?.invoice}</TableCell>
            <TableCell className="text-sky-500 font-bold">
              {item?.total_amount.toFixed(2)}
            </TableCell>
            <TableCell
              className={cn(
                "",
                item?.type == "CASH" && "text-amber-500",
                item?.type == "MPESA" && "text-emerald-500"
              )}
            >
              {item?.type}
            </TableCell>
            <TableCell>
              {moment(item?.createdAt).format("hh:mm:ss A")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
