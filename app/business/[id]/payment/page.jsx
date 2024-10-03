import React from "react";
import { PaymentTable } from "./_components/payments-table";
import { db } from "@/utils/db";
import { GetPayments } from "@/actions/payments.action";

async function PaymentPage({ params }) {
  const b_id = params.id;

  const { payments } = await GetPayments(b_id);

  console.log(
    "======================================================================================="
  );


  // console.log(payments)

  return (
    <div>
      <div className="text-sm text-zinc-500">
        Payments are displayed from the latest to oldest
      </div>

      {/* PAYMENT TABLE */}
      <div>
        <PaymentTable data={payments} />
      </div>
    </div>
  );
}

export default PaymentPage;
