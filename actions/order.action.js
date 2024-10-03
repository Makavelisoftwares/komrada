"use server";

import { db } from "@/utils/db";

export const createOrder = async (
  b_id,
  name,
  price,
  count,
  invoice,
  productId
) => {
  const newOrder = await db.order.create({
    data: {
      invoice,
      businessId: b_id,
      count,
      name,
      price,
      productId,
    },
  });

  return { newOrder };
};

export const getOrdersByInvoice = async (invoice) => {
  const getAllOrders = await db.order.findMany({
    where: {
      invoice,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { OrdersByInvoice: getAllOrders };
};

export const GetAsingleOrder = async (orderId) => {
  const getOrder = await db.order.findUnique({
    where: {
      id: orderId,
    },
  });

  return { getOrder };
};

export const getOrderWithInvoice = async (invoice) => {
  const getorder = await db.order.findMany({
    where: {
      invoice,
    },
    include: {
      product: true,
    },
  });

  return {getorder}
};
