import React from "react";
import { CreateCompany } from "./_components/create-company";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";

async function CreateCompanyPage({ searchParams }) {
  const userId = searchParams.id;

  const getBusinesses = await db.business.findMany();
  if (getBusinesses.length > 0) {
   return redirect(`/business/${getBusinesses[0].id}`);
  }

  return (
    <div className="w-[550px] m-auto h-screen flex items-center justify-center">
      <CreateCompany userId={userId} />
    </div>
  );
}

export default CreateCompanyPage;
