"use client";

import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  RefreshCwIcon,
  ShoppingBasketIcon,
  Trash,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PaymentCash } from "./_payment/cash-payment";
import { MpesaPayment } from "./_payment/mpesa-payment";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { TrackProductCount } from "@/actions/product.action";

export const Cart = ({ b_id }) => {
  const { refresh } = useRouter();
  const [localstorageItems, setLocalstorageItems] = useState([]);
  const [gandTotal, setgandTotal] = useState(0);

  const [totalPrice, settotalPrice] = useState(0);

  useEffect(() => {
    const getLocalstorageItems = () => {
      if (typeof window !== "undefined") {
        let cart_localstorage_items =
          window.localStorage.getItem("cart_items_array");
        if (cart_localstorage_items) {
          let cart_items = JSON.parse(cart_localstorage_items) || [];

          const total_price = cart_items.reduce(
            (sum, item) => sum + item?.price,
            0
          );

          settotalPrice(total_price);
          setgandTotal(total_price);

          setLocalstorageItems(cart_items);
          refresh();
        }
      }
    };

    getLocalstorageItems();
  }, []);

  const handleIncrement = async (item) => {
    let count = item?.count;

    let cart_item_price = item.price / count;

    let new_count = count + 1;

    let total_price = cart_item_price * new_count;

    item.price = total_price;
    item.count = new_count;

    if (typeof window !== "undefined") {
      const { error, ok } = await TrackProductCount(item?.id, item?.count);
      if (error) {
        return toast.error(error);
      }

      if (!error) {
        const cart_items = window.localStorage.getItem("cart_items_array");
        let new_cart_items = JSON.parse(cart_items);

        let i = new_cart_items.findIndex((it) => it.id == item.id);
        new_cart_items[i] = item;

        window.localStorage.setItem(
          "cart_items_array",
          JSON.stringify(new_cart_items)
        );

        toast.success(`${item?.name} was added to cart`);
        refresh();
      }
    }
  };

  const handleDeIncrement = (item) => {
    let count = item?.count;

    if (count < 1) {
      if (typeof window !== "undefined") {
        const cart_items = window.localStorage.getItem("cart_items_array");
        let new_cart_items = JSON.parse(cart_items);

        const new_cart_items_array = new_cart_items.filter(
          (it) => it.count > 0
        );

        window.localStorage.setItem(
          "cart_items_array",
          JSON.stringify(new_cart_items_array)
        );

        setLocalstorageItems(new_cart_items_array);

        refresh();
      }

      return;
    } else {
      let cart_item_price = item.price / count;

      let new_count = count - 1;

      let total_price = cart_item_price * new_count;

      item.price = total_price;
      item.count = new_count;

      if (typeof window !== "undefined") {
        const cart_items = window.localStorage.getItem("cart_items_array");
        let new_cart_items = JSON.parse(cart_items);

        let i = new_cart_items.findIndex((it) => it.id == item.id);
        new_cart_items[i] = item;

        window.localStorage.setItem(
          "cart_items_array",
          JSON.stringify(new_cart_items)
        );

        toast.success(`${item?.name} was deducted from cart`);
        refresh();

        return;
      }
    }
  };

  const handleDiscount = (e) => {
    if (typeof window !== "undefined") {
      if (e.target.value == "") {
        const calculated_discount = (0 / 100) * totalPrice;
        const new_price = totalPrice - calculated_discount;

        setgandTotal(new_price);
      } else {
        const dis = e.target.value;
        const parsed_discount = parseFloat(dis);

        const calculated_discount = (parsed_discount / 100) * totalPrice;
        const new_price = totalPrice - calculated_discount;

        setgandTotal(new_price);
      }
    }
  };

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      let cart_items = window.localStorage.getItem("cart_items_array");
      let new_cart_items = JSON.parse(cart_items);
      setLocalstorageItems(new_cart_items || []);

      const total_price = new_cart_items.reduce(
        (sum, item) => sum + item?.price,
        0
      );

      settotalPrice(total_price);
      setgandTotal(total_price);

      refresh();
    }
  };

  const handleDeleteItem = (id) => {
    if (typeof window !== "undefined") {
      const cart_items = window.localStorage.getItem("cart_items_array");
      let new_cart_items = JSON.parse(cart_items);

      const new_items = new_cart_items.filter((it) => it?.id !== id);

      window.localStorage.setItem(
        "cart_items_array",
        JSON.stringify(new_items)
      );

      setLocalstorageItems(new_items);

      refresh();
    }

    return;
  };

  const handleClearCart = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("cart_items_array");
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <Button onClick={handleClearCart} variant="ghost" size="sm">
          <Trash />
        </Button>

        <div className="font-bold text-sm uppercase">cart</div>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCwIcon />
        </Button>
      </div>

      {localstorageItems.length >= 1 ? (
        <>
          <div className="text-lg font-bold text-center p-1">Checkout</div>

          <div className="flex bg-[#f4f4f4] items-center space-x-2 p-1">
            <div className="w-[50px] text-sm p-1"></div>

            <div className="w-[150px]  text-sm p-1 ">NAME</div>
            <div className="w-[130px] text-sm p-1 flex items-center justify-center text-center">
              QTY
            </div>

            <div className="w-full text-sm p-1 flex items-center justify-center">
              PRICE
            </div>
          </div>
          <ScrollArea className="w-full h-[40vh]">
            {localstorageItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center border-b border-zinc-200 space-x-2 py-2"
              >
                <div
                  onClick={() => handleDeleteItem(item.id)}
                  className="w-[50px] cursor-pointer text-sm p-1"
                >
                  <X />
                </div>

                <div className="w-[150px]  text-center text-sm p-1 ">
                  {item?.name}
                </div>
                <div className="w-[130px] text-sm flex items-center justify-between p-1 text-center ">
                  <div
                    onClick={() => handleDeIncrement(item)}
                    className="h-[25px] w-[25px] bg-zinc-500 flex items-center justify-center text-white cursor-pointer"
                  >
                    <Minus />
                  </div>

                  <div>{item?.count}</div>

                  <div
                    onClick={() => handleIncrement(item)}
                    className="h-[25px] w-[25px] flex items-center justify-center bg-emerald-500 text-white cursor-pointer"
                  >
                    <Plus />
                  </div>
                </div>

                <div className="w-[80%] text-center  pr-10 space-x-1 text-sm p-1 flex items-center justify-center font-bold">
                  <span>Ksh. </span>
                  <span>{item?.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="flex bg-[#f4f4f4] items-center space-x-2 p-1">
            <div className="w-[200px] font-bold text-sm p-1">Sub Total</div>
            <div className="w-[120px] flex items-center justify-center text-sm p-1 text-center"></div>

            <div className="w-full space-x-1 text-sky-500 font-bold text-sm p-1 flex items-center justify-end">
              <span>Ksh. </span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex bg-[#f4f4f4] items-center space-x-2 p-1">
            <div className="w-[200px] font-bold text-sm p-1">Discount(%)</div>
            <div className="w-[120px] flex items-center justify-center text-sm p-1 text-center"></div>

            <div className="w-full space-x-1 text-sky-500 font-bold text-sm p-1 flex items-center justify-end">
              <Input
                onChange={handleDiscount}
                type="number"
                min={0}
                placeholder={0}
              />
            </div>
          </div>
          {/* <div className="flex bg-[#f4f4f4] items-center space-x-2 p-1">
            <div className="w-[200px] font-bold text-sm p-1">Taxes</div>
            <div className="w-[120px] flex items-center justify-center text-sm p-1 text-center"></div>

            <div className="w-full space-x-1 text-sky-500 font-bold text-sm p-1 flex items-center justify-end">
              <span>Ksh. </span>
              <span>{totalPrice.toFixed(2)}</span>
            </div>
          </div> */}

          <div className="flex bg-[#f4f4f4] items-center space-x-2 p-1">
            <div className="w-[200px] font-bold text-sm p-1">Grand Total</div>
            <div className="w-[120px] flex items-center justify-center text-sm p-1 text-center"></div>

            <div className="w-full space-x-1 text-sky-500 font-bold text-sm p-1 flex items-center justify-end">
              <span>Ksh. </span>
              <span>{gandTotal.toFixed(2)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center  flex-col space-y-2 min-h-[70vh] w-[300px] m-auto text-zinc-600">
          <ShoppingBasketIcon className="w-[50px] h-[50px]" />
          <div className="text-xs text-center">
            Your cart is currently empty.Add an item and click the refresh
            button to get started.
          </div>
        </div>
      )}

      {localstorageItems.length > 0 && (
        <div className="flex flex-col w-full  mt-1 ">
          <div className="w-full mb-1 ">
            <PaymentCash
              className="w-full"
              grandTotal={gandTotal}
              b_id={b_id}
            />
          </div>

          <div className="w-full mb-1 ">
            <MpesaPayment
              className="w-full"
              grandTotal={gandTotal}
              b_id={b_id}
            />
          </div>

          <div className="cursor-none text-center text-zinc-400 text-sm">
            card payment comming soon
          </div>
        </div>
      )}
    </div>
  );
};
