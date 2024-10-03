import { getUserByEmail } from "@/utils/get-user";
import React from "react";
import { CreateNewCompany } from "./_components/create-new-company";

async function CreateBusinessPage() {
  const { user } = await getUserByEmail();
  const id = user?.id;

  console.log(id)
  return (
    <div>
      <div className="w-[550px] m-auto h-screen flex items-center justify-center">
        <CreateNewCompany userId={id} />
      </div>
    </div>
  );
}

export default CreateBusinessPage;
