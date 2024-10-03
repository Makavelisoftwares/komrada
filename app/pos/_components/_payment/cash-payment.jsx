import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { Equal, Loader, Minus, X } from "lucide-react";
import { CashPay, createPaymentByCash, DeductItems } from "@/actions/cash.pay";
import {
  createOrder,
  GetAsingleOrder,
  getOrdersByInvoice,
} from "@/actions/order.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DeductProductCount } from "@/actions/product.action";
import { MakeDeduction } from "@/actions/mpesa.stk.action";

export const PaymentCash = ({ grandTotal, b_id }) => {
  const [isMounted, setisMounted] = useState(false);
  const [invoice, setinvoice] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [isPending, startTransition] = useTransition(false);
  const [open, setopen] = useState(false);
  const { refresh } = useRouter();
  const [cashpayment, setcashpayment] = useState(null);
  const [customerChange, setcustomerChange] = useState(0);

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleCancel = () => {
    setopen(false);
  };

  const onSubmit = () => {
    startTransition(async () => {
      if (typeof window !== "undefined") {
        const cart_items =
          window.localStorage.getItem("cart_items_array") || [];
        if (cart_items.length > 0) {
          const new_cart_items = JSON.parse(cart_items) || [];

          let order;
          for (let it of new_cart_items) {
            let { newOrder } = await createOrder(
              b_id,
              it.name,
              it.price,
              it.count,
              invoice,
              it.id
            );

            order = newOrder;
          }

          if (order) {
            const { OrdersByInvoice } = await getOrdersByInvoice(
              order?.invoice
            );

            if (OrdersByInvoice.length > 0) {
              for (let item of OrdersByInvoice) {
                await createPaymentByCash(item?.invoice, grandTotal, item?.id,b_id);

                await MakeDeduction(item?.productId, item?.count);

                toast.success("payment was successfully completed");

                window.localStorage.removeItem("cart_items_array");

                window.location.reload();
              }
            }
          }
        }
      }
    });
  };

  const handleCart = () => {
    const invoice_number = Math.floor(Math.random() * 100000);
    if (typeof window !== "undefined") {
      let cart_items = window.localStorage.getItem("cart_items_array") || [];
      let new_cart_items = JSON.parse(cart_items) || [];
      if (new_cart_items.length > 0) {
        const total_price = new_cart_items.reduce(
          (sum, item) => sum + item?.price,
          0
        );

        setinvoice(invoice_number);
        settotalAmount(grandTotal);
      }
    }
  };

  const handleChange = (e) => {
    if (typeof window !== "undefined") {
      const val = e.target.value;
      if (val == NaN) {
        setcustomerChange(0);
      } else {
        const new_num = parseInt(val) - totalAmount;
        setcustomerChange(new_num);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setopen}>
      <AlertDialogTrigger className="w-full">
        <Button
          onClick={handleCart}
          className="bg-amber-500 w-[100%] hover:bg-amber-600 "
        >
          PAY WITH CASH{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex font-bold items-center justify-between">
            <div>PAY WITH CASH</div>
            <div className="flex items-center space-x-3">
              <div>#{invoice}</div>
              <div onClick={handleCancel}>
                <X className="h-[20px] w-[20px] cursor-pointer" />
              </div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to pay{" "}
            <span className="font-bold text-sky-500 text-md">
              Ksh. {grandTotal.toFixed(2)}
            </span>{" "}
            with invoice number of{" "}
            <span className="font-bold text-sky-500 text-md">#{invoice}</span>{" "}
            using cash payment?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center flex-col ">
            <div>Customer Paid</div>
            <Input
              onChange={handleChange}
              className="w-[100px]"
              type="number"
            />
          </div>
          <Minus />

          <div>
            <span>Total Amount</span>
            <div className="border-zinc-500/30 border p-3  w-[100px] text-zinc-500">
              {grandTotal.toFixed(2)}
            </div>
          </div>

          <Equal />
          <div>
            <span>Return</span>
            <div className="border-zinc-500/30 border p-3  w-[100px] text-zinc-500">
              {customerChange.toFixed(2)}
            </div>
          </div>
        </div>

        <Button
          disabled={isPending}
          onClick={onSubmit}
          className="w-full bg-sky-900 text-white "
        >
          {isPending ? (
            <div className="flex items-center space-x-2">
              <Loader className="animate-spin" />
              <div>PURCHASING</div>
            </div>
          ) : (
            <div>COMPLETE PAYMENT</div>
          )}
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
};
