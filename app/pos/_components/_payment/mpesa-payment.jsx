import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MpesaSchema } from "@/validation/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { Loader, X } from "lucide-react";
import {
  MakeDeduction,
  PaidViaMpesa,
  stkPush,
} from "@/actions/mpesa.stk.action";
import { toast } from "sonner";
import { createOrder, getOrdersByInvoice } from "@/actions/order.action";

export const MpesaPayment = ({ grandTotal, b_id }) => {
  const [isMounted, setisMounted] = useState(false);
  const [invoice, setinvoice] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [isPending, startTransition] = useTransition(false);
  const [open, setopen] = useState(false);
  const [error, seterror] = useState("");
  const [success, setsuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(MpesaSchema),
  });

  useEffect(() => {
    setisMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleCancel = () => {
    setopen(false);
  };

  function onSubmit(values) {
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
              const { error, valid } = await stkPush(values.phone, grandTotal);

              if (!error) {
                for (let item of OrdersByInvoice) {
                  await PaidViaMpesa(item?.invoice, item?.id, grandTotal,b_id);

                  await MakeDeduction(item?.productId, item?.count);

                  seterror("");

                  setsuccess(valid);

                  toast.success(valid);

                  window.localStorage.removeItem("cart_items_array");

                  window.location.reload();
                }
              } else {
                setsuccess("");

                seterror(error);

                toast.error(error);
              }
            }
          }
        }
      }
    });
  }

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
        settotalAmount(total_price);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setopen}>
      <AlertDialogTrigger className="w-full">
        <Button
          onClick={handleCart}
          className="bg-emerald-500 w-full hover:bg-emerald-600 text-white"
        >
          PAY WITH MPESA
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex font-bold items-center justify-between">
            <div>PAY WITH MPESA</div>
            <div className="flex items-center space-x-3">
              <div>#{invoice}</div>
              <div onClick={handleCancel}>
                <X className="h-[20px] w-[20px] cursor-pointer" />
              </div>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              Are you sure you want to pay{" "}
              <span className="font-bold text-sky-500 text-md">
                Ksh {grandTotal.toFixed(2)}
              </span>{" "}
              with invoice number of{" "}
              <span className="font-bold text-sky-500  text-md">
                #{invoice}
              </span>{" "}
              using mpesa?
            </div>

            {error && (
              <div className="text-sm font-bold text-rose-400 bg-rose-200/40 border border-rose-500 p-2 w-full rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm font-bold text-emerald-400 bg-emerald-200/40 border border-emerald-500 p-2 w-full rounded-md">
                {success}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number(SAFARICOM)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="0700112233"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-700"
            >
              {isPending ? (
                <div className="flex items-center space-x-1">
                  <Loader className="animate-spin" />
                  <div>SENDING STK</div>
                </div>
              ) : (
                <div>PROCEED WITH PAYMENT</div>
              )}
            </Button>
          </form>
        </Form>

        {/* <AlertDialogFooter>
          <AlertDialogCancel>cancel</AlertDialogCancel>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
};
