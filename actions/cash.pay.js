"use server";

import { db } from "@/utils/db";

export const createPaymentByCash = async (
  invoiceId,
  amount,
  orderId,
  businessId
) => {
  const createPayment = await db.payment.create({
    data: {
      invoice: invoiceId,
      orderId,
      total_amount: parseFloat(amount),
      BusinessId:businessId,
      type: "CASH",
    },
  });

  return { success_payment: createPayment };
};
