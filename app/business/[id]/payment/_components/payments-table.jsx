"use client";

import { getOrdersByInvoice } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader, MoreHorizontal, RefreshCcw } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const PaymentTable = ({ data }) => {
  const { refresh } = useRouter();
  const [items, setitems] = useState([]);
  const [orders, setorders] = useState([]);

  useEffect(() => {
    let uniqueSet = new Set();
    let new_data = data.filter((e) => {
      if (!uniqueSet.has(e.invoice)) {
        uniqueSet.add(e.invoice);
        return true;
      }

      return false;
    });

    setitems(new_data);

    for (let i of data) {
      console.log(i.order.product);
    }
  }, []);

  const handleRefresh = () => {
    refresh();

    toast.success("Payments are upto date");

    return;
  };

  const handleOrder = async (invoice) => {
    const { OrdersByInvoice } = await getOrdersByInvoice(invoice);

    setorders(OrdersByInvoice);
  };

  console.log(orders)

  return (
    <div>
      <div className="flex items-center justify-end">
        <Button
          onClick={handleRefresh}
          variant="ghost"
          className="flex items-center space-x-2"
          size="sm"
        >
          <RefreshCcw />
          <span>Refresh Payments</span>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableHead>Invoice</TableHead>

          <TableHead>Payment Type</TableHead>

          <TableHead>Payment Amount</TableHead>

          <TableHead>Payment time</TableHead>

          <TableHead>Payment date</TableHead>
        </TableHeader>
        <TableBody>
          {items?.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-bold">#{item?.invoice}</TableCell>
              <TableCell>
                {item?.type == "CASH" ? (
                  <div className="p-1 font-bold text-xs  rounded-md text-amber-500">
                    CASH PAYMENT
                  </div>
                ) : (
                  <div className="p-1 font-bold text-xs rounded-md text-emerald-500">
                    MPESA PAYMENT
                  </div>
                )}
              </TableCell>
              <TableCell className="text-sky-600 font-bold">
                Ksh. {item?.total_amount.toFixed(2)}
              </TableCell>
              <TableCell>
                {moment(item?.createdAt).format("hh:m:ss A")}
              </TableCell>
              <TableCell>
                {moment(item?.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent>
                    {orders.length > 0 ? (
                      <div>
                        {orders.map((it, i) => (
                          <div key={i}>
                            {it?.invoice == item?.invoice ? (
                              <div>
                                <div className="flex font-bold text-sm items-center justify-between">
                                  <div>Invoice</div>
                                  <div>#{item?.invoice}</div>
                                </div>
                                <div>{it?.name}</div>
                              </div>
                            ) : (
                              <div
                                onClick={() => handleOrder(item?.invoice)}
                                className="flex items-center cursor-pointer space-x-1"
                              >
                                <Loader />
                                <span>load items</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        onClick={() => handleOrder(item?.invoice)}
                        className="flex items-center cursor-pointer space-x-1"
                      >
                        <Loader />
                        <span>load items</span>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
