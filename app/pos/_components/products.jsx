"use client";

import { TrackProductCount } from "@/actions/product.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, Lock, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Products = ({ biz_products }) => {
  const { refresh } = useRouter();
  const handleCart = async (item) => {
    if (typeof window !== "undefined") {
      let cart_items_array = [];
      let cart_items_object = {};
      let count = 1;

      const cart_items = window.localStorage.getItem("cart_items_array");

      if (cart_items) {
        // local storage items available

        let new_cart_items = JSON.parse(cart_items);

        let filterItemfromCart = new_cart_items.filter(
          (it) => it.id == item?.id
        );

        let new_price;

        if (filterItemfromCart.length > 0) {
          new_price = filterItemfromCart[0].price + item?.sellprice;
          count = filterItemfromCart[0].count + 1;
          const i = new_cart_items.findIndex((it) => it.id == item?.id);

          const { error, ok } = await TrackProductCount(item?.id, count);
          if (error) {
            toast.error(error);
          } else {
            let new_object_item = {
              id: item?.id,
              price: new_price,
              name: item?.name,
              count,
            };

            new_cart_items[i] = new_object_item;

            window.localStorage.setItem(
              "cart_items_array",
              JSON.stringify([...new_cart_items])
            );

            toast.success(`${item?.name} was added to cart`);
            refresh();
          }
        } else {
          const { error, ok } = await TrackProductCount(item?.id, count);

          if (error) {
            toast.error(error);
          } else {
            cart_items_object = {
              id: item.id,
              name: item.name,
              price: item.sellprice,
              count,
            };

            new_cart_items.unshift(cart_items_object);

            window.localStorage.setItem(
              "cart_items_array",
              JSON.stringify(new_cart_items)
            );

            toast.success(`${item?.name} was added to cart`);

            refresh();
          }
        }
      } else {
        //local storage items not available
        window.localStorage.setItem(
          "cart_items_array",
          JSON.stringify(cart_items_array)
        );

        const items = window.localStorage.getItem("cart_items_array");

        let new_cart_items = JSON.parse(items);

        const findItemfromCart = new_cart_items.find((it) => it.id == item?.id);

        refresh();

        if (findItemfromCart) {
          console.log("item present");

          refresh();
        } else {
          cart_items_object = {
            id: item.id,
            name: item.name,
            price: item.sellprice,
            count,
          };

          new_cart_items.unshift(cart_items_object);

          window.localStorage.setItem(
            "cart_items_array",
            JSON.stringify(new_cart_items)
          );

          toast.success(`${item?.name} was added to cart`);

          refresh();
        }
      }
    }

    refresh();

    return;
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {biz_products?.map((item, i) => (
        <Card className="col-span-1 relative shadow-none space-x-1   " key={i}>
          <CardContent>
            <div className="flex relative w-full h-[100px]  space-x-1">
              {item?.image ? (
                <Image
                  src={item?.image}
                  className=" object-cover"
                  alt={item?.name}
                  fill
                />
              ) : (
                <Image
                  className=" object-cover"
                  fill
                  alt={item?.name}
                  src="/no-img.jpg"
                />
              )}
            </div>

            <div className="mt-2 flex flex-col items-center text-sm justify-center text-center">
              <div className="font-bold  uppercase">{item?.name}</div>
              <div className="w-full text-zinc-400">
                {item?.description.slice(0, 50)}
              </div>
            </div>
            <div className="flex items-center justify-center text-sm font-bold text-sky-500 space-x-1">
              <div className=" text-sm">Ksh. </div>
              <div className=" font-bold">{item?.sellprice.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-between">
              {item?.quantity < 1 && (
                <div className="mt-2 cursor-not-allowed flex items-center justify-center space-x-2 w-full">
                  <Lock className="h-[40px] w-[40px] text-zinc-500 flex items-center justify-center  " />
                  <span className="text-zinc-500 text-sm">Out of stock</span>{" "}
                </div>
              )}

              {item?.quantity >= 1 && (
                <div
                  className="mt-2 flex items-center w-full rounded-md bg-rose-500 text-sm justify-center hover:bg-rose-500 text-white  space-x-1 cursor-pointer"
                  onClick={() => handleCart(item)}
                >
                  <Plus className="h-[40px] w-[40px] rounded-full flex items-center justify-center  " />
                  <span>Add to cart</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
