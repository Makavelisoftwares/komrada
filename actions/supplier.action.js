"use server";

import { db } from "@/utils/db";
import { revalidatePath } from "next/cache";

export const getSuppliers = async (b_id) => {
  const suppliers = await db.supplier.findMany({
    where: {
      businessId: b_id,
    },
  });

  return { suppliers };
};

export const CreateSupplier = async (b_id, name, email, address,phone) => {
  if (!b_id || !name || !email || !address || !phone) {
    return { error: "Missing field" };
  }

  await db.supplier.create({
    data: {
      address,
      businessId: b_id,
      email,
      name,
      phone,
    },
  });

  revalidatePath(`/business/${b_id}`);
  return { success: "supplier has been saved" };
};
