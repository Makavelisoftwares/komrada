"use server";

import { db } from "@/utils/db";
import { revalidatePath } from "next/cache";

export const createProduct = async (
  b_id,
  productImage,
  name,
  description,
  costprice,
  sellprice,
  quantity,
  categoryId,
  supplierId
) => {
  if (
    !name ||
    !description ||
    !costprice ||
    !sellprice ||
    !quantity ||
    !categoryId ||
    !supplierId ||
    !b_id
  ) {
    return { error: "Missing field" };
  }

  const new_costprice = parseFloat(costprice);
  const new_sellprice = parseFloat(sellprice);
  const new_quantity = parseFloat(quantity);

  await db.product.create({
    data: {
      businessId: b_id,
      image: productImage,
      categoryId,
      costprice: new_costprice,
      sellprice: new_sellprice,
      description,
      name,
      quantity: new_quantity,
      supplierId,
    },
  });

  revalidatePath(`/business/${b_id}/product`);

  return { success: "product has been saved" };
};

export const getProducts = async (b_id) => {
  const products = await db.product.findMany({
    where: {
      businessId: b_id,
    },
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { products };
};

export const getSinglePoduct = async (p_id) => {
  const singleProduct = await db.product.findUnique({
    where: {
      id: p_id,
    },
  });

  return { product: singleProduct };
};

export const DeductProductCount = async (productId, count) => {
  const getproduct = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (getproduct?.quantity < count) {
    return { deduction_error: `kindly restock ${getproduct.name}` };
  } else {
    await db.product.update({
      where: {
        id: getproduct?.id,
      },
      data: {
        quantity: getproduct?.quantity - count,
      },
    });

    return { deduction_success: "payment was successful" };
  }
};

export const TrackProductCount = async (productId, count) => {
  const getProduct = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (getProduct.quantity < count) {
    return {
      error: `${getProduct.name} cannot be added to cart. You only have ${getProduct?.quantity} in stock`,
    };
  }

  return { ok: "ok" };
};
