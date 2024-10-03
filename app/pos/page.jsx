import React from "react";
import { BusinessName } from "./_components/business-name";
import { getBusiness } from "@/actions/business.action";
import { Products } from "./_components/products";
import { Cart } from "./_components/cart";

async function PosPage({ searchParams }) {
  const b_id = searchParams.id;
  const { biz: pos_business } = await getBusiness(b_id);

  return (
    <div className="p-2">
      <div className="mb-3 p-2 border-zinc-300/30 border-b">
        <BusinessName pos_business={pos_business} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Products biz_products={pos_business?.Product} />
        </div>
        <div className="col-span-1">
          <Cart  b_id={b_id}/>
        </div>
      </div>
    </div>
  );
}

export default PosPage;
