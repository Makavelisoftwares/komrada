"use client";

import { getOrderWithInvoice } from "@/actions/order.action";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, MoreHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

export const OrderTable = ({ data }) => {
  const [isMounted, setisMounted] = useState(false);

  const handleHover = async (invoice) => {
    const { getorder } = await getOrderWithInvoice(invoice);

    console.log(getorder);
  };

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableHead>Order</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Products</TableHead>
        <TableHead>Total Amount</TableHead>
      </TableHeader>
      <TableBody>
        {data?.map((item, i) => (
          <TableRow key={i}>
            <TableCell>#{item?.invoice}</TableCell>
            <TableCell>
              {item?.payment.length > 0 ? (
                <Badge className="flex items-center  w-[160px]  justify-center text-emerald-500 bg-emerald-200 hover:bg-emerald-200">
                  <Check />
                  <span>paid</span>
                </Badge>
              ) : (
                <Badge className="flex w-[160px] items-center justify-center text-rose-500 bg-rose-200 hover:bg-rose-200">
                  <X />
                  <span>cancelled</span>
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <MoreHorizontal onMouseEnter={() => handleHover(item?.invoice)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
