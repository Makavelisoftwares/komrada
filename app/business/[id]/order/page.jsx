import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/utils/db";
import React from "react";
import { OrderTable } from "./_components/order-table";

async function OrdersPage({ params }) {
  const b_id = params.id;

  const orders = await db.order.findMany({
    where: {
      businessId: b_id,
    },
    include: {
      product: true,
      business: true,
      payment: true,
    },
  });

  console.log("========================================================");
//   console.log(orders);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          Orders will be displayed from the latest to the odd
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderTable data={orders} />
      </CardContent>
    </Card>
  );
}

export default OrdersPage;
