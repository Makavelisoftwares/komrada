import { getUserByEmail } from "@/utils/get-user";
import { LogOut } from "./log-out";

export const Profile = async () => {
  const { user } = await getUserByEmail();
  return (
    <div className="flex items-center space-x-2">
      <div className="text-white h-[40px] w-[40px] font-bold uppercase flex items-center justify-center bg-rose-600 rounded-md">
        {user?.name[0]}
      </div>
      <div>
        <div className="text-sm font-bold">{user?.name}</div>
        <div className="text-xs text-zinc-400/60">{user?.email}</div>
      </div>

      <div>
        <LogOut />
      </div>
    </div>
  );
};
