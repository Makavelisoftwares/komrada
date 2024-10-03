"use server";
import { db } from "@/utils/db";
import { revalidatePath } from "next/cache";
export const getCategories = async (b_id) => {
  const categories = await db.category.findMany({
    where: {
      businessId: b_id,
    },
  });

  return { categories };
};

export const createCategory = async (name, desc, b_id) => {
  if (!b_id || !desc || !name) {
    return { error: "A field is missing" };
  }
  
  await db.category.create({
    data: {
      businessId: b_id,
      name,
      description: desc,
    },
  });
  revalidatePath(`/business/${b_id}`);

  return { success };
};
