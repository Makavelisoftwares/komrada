"use server";

import { db } from "@/utils/db";

export const GetPayments = async (b_id) => {
  const payments = await db.payment.findMany({
    where: {
      BusinessId: b_id,
    },
    include: {
      order: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { payments };
};
