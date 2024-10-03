import React from "react";
import { ProductTableAndForm } from "./_components/product-table-form";
import { ProductForm } from "./_components/product-form";
import { ProductTable } from "./_components/product-table";
import { getSuppliers } from "@/actions/supplier.action";
import { getCategories } from "@/actions/category.action";
import { getProducts } from "@/actions/product.action";

async function ProductPage({ params }) {
  const b_id = params.id;

  const { suppliers } = await getSuppliers(b_id);
  const { categories } = await getCategories(b_id);
  const { products } = await getProducts(b_id);

  return (
    <div>
      <div>
        <ProductTableAndForm />
      </div>

      <div>
        <div className="product-form hidden">
          <ProductForm
            suppliers={suppliers}
            b_id={b_id}
            categories={categories}
          />
        </div>
        <div className="product-table mt-4">
          <ProductTable products={products} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
