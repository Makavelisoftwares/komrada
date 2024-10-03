import React from "react";
import { CustomerChart } from "../_components/_sub-components/customer-chart";
import { getCategories } from "@/actions/category.action";
import { CreateAlertCategory } from "../_components/alert-boxes/create-category";
import { getSuppliers } from "@/actions/supplier.action";
import {
  BarChart2Icon,
  BarChartHorizontalBig,
  Check,
  LineChartIcon,
  Wallet,
} from "lucide-react";
import { CreateAlertSupplier } from "../_components/alert-boxes/create-supplier";
import { Cards } from "../_components/Cards";
import { getUserByEmail } from "@/utils/get-user";
import { WelcomeUser } from "../_components/welcome-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockLevelChart } from "../_components/charts/stock-level.chart";
import { TopItemChart } from "../_components/charts/top-item-chart";
import { TodayPaymentTable } from "../_components/charts/payment.table";
import { getProducts } from "@/actions/product.action";
import { GetPayments } from "@/actions/payments.action";

export const dynamic = "force-dynamic";

async function BusinessPage({ params }) {
  const b_id = params.id;
  const { categories } = await getCategories(b_id);
  const { suppliers } = await getSuppliers(b_id);
  const { user } = await getUserByEmail();
  const { products } = await getProducts(b_id);
  const { payments } = await GetPayments(b_id);

  let todays_date = new Date().toLocaleDateString();

  // ======================== PRODUCTS =============================

  const fiterProductsOutOfStock = products.filter((item) => item.quantity == 0);
  const fiterProductsInStock = products.filter((item) => item.quantity !== 0);

  // ======================= PAYMENTS ====================================
  const filterTodayPayments = payments.filter((item) => {
    const item_date = item?.createdAt.toLocaleDateString();

    return item_date == todays_date;
  });

  const today_payment = filterTodayPayments.reduce(
    (sum, item) => sum + item.total_amount,
    0
  );

  // ================================ TOTAL REVENUE =======================================
  const total_revenue = payments.reduce(
    (sum, item) => sum + item?.total_amount,
    0
  );

  return (
    <div>
      {/* 
      ========================== LOGGED IN USER =================
      */}
      <div>
        <WelcomeUser user={user} />
      </div>

      <div>
        {categories.length == 0 ? (
          <div>
            <div className="h-[40px] w-[40px] rounded-full text-rose-500 text-4xl mt-4 border-2 border-red-500 flex items-center justify-center p-1 font-bold">
              1
            </div>
            <div className="flex items-center flex-col justify-center h-[50vh]">
              <div className="text-sm">
                Start by creating a category for your product
              </div>
              <CreateAlertCategory b_id={b_id} />
            </div>
          </div>
        ) : (
          <>
            {suppliers.length == 0 ? (
              <div>
                <div className="my-2 text-emerald-500">
                  🎉🎉Huree!!! You completed your first step
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-[40px] w-[40px] rounded-full text-white text-4xl mt-4 border-2 bg-emerald-500 border-emerald-500  flex items-center justify-center p-1 font-bold">
                    <Check />
                  </div>
                  <div className="w-[50px] h-[2px] flex bg-zinc-400/50" />
                  <div className="h-[40px] w-[40px] rounded-full text-4xl mt-4 border-2  text-rose-500 border-red-500 flex items-center justify-center p-1 font-bold">
                    2
                  </div>
                </div>

                <div className="flex items-center flex-col justify-center h-[50vh]">
                  <div className="text-sm">Save a supplier for your stocks</div>
                  <CreateAlertSupplier b_id={b_id} />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                {/* 
                  ======================= SUMMARY CARDS ========================
                */}
                <div>
                  <div className="">
                    <div className="grid grid-cols-4 p-2 gap-2">
                      {/* ================  */}

                      <div className="col-span-1">
                        <Cards
                          number={total_revenue}
                          price="KSH"
                          title="Total Revenue"
                          icon={<LineChartIcon className="text-emerald-500" />}
                        />
                      </div>

                      <div className="col-span-1">
                        <Cards
                          number={fiterProductsInStock.length}
                          title="Items In stock"
                          icon={<BarChart2Icon className="text-amber-500" />}
                        />
                      </div>

                      <div className="col-span-1">
                        <Cards
                          number={fiterProductsOutOfStock.length}
                          title="Items out stock"
                          icon={
                            <BarChartHorizontalBig className="text-red-500" />
                          }
                        />
                      </div>

                      <div className="col-span-1">
                        <Cards
                          number={today_payment}
                          title="Today's payment"
                          price="KSH"
                          icon={<Wallet className="text-sky-500" />}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 
                
                ======================== CHARTS===============================
                */}

                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="col-span-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-1">
                        {/* chart 1 ---stock level*/}
                        {/* <StockLevelChart data={products}/> */}
                      </div>
                      <div className="col-span-1">
                        {/* chart 2 */}

                        <TopItemChart date={todays_date}/>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    {/* Top Product */}
                    <div className="font-bold">{todays_date} Payments</div>
                    <TodayPaymentTable
                      filterTodayPayments={filterTodayPayments}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessPage;
