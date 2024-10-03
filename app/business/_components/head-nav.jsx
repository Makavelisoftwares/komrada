import { getServerSession } from "next-auth";
import { BusinessNameCombobox } from "./_sub-components/business-name";
import { Profile } from "./_sub-components/profile";
import { AuthOptions } from "@/utils/auth-options";
import { getUserByEmail } from "@/utils/get-user";
import { getAllBusiness } from "@/actions/business.action";

export const HeadNav = async () => {
  const { user } = await getUserByEmail();

  const {allBusiness}=await getAllBusiness(user?.id)

  return (
    <div className="flex m-auto md:w-[90%] items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center tracking-wider text-4xl font-extrabold">
          <span className="text-rose-700 ">kom</span>
          <span>rada</span>
        </div>

        <div className="text-zinc-400/70 text-4xl">/</div>

        <div>
          <BusinessNameCombobox Data={allBusiness} />
        </div>
        <div className="text-zinc-400/70 text-4xl">/</div>
      </div>

      <div>
        <Profile />
      </div>
    </div>
  );
};
