import React from "react";
import { HeadNav } from "./_components/head-nav";
import { SideBar } from "./_components/side-bar";

function BusinessLayout({ children }) {
  return (
    <div>
      <div className="py-3 border-b z-40 border-zinc-200 shadow-sm">
        <HeadNav />
      </div>
      <div className="md:w-[90%] mt-10 flex m-auto">
        <div className="h-screen w-[200px] fixed">
          <SideBar />
        </div>
        <div className="ml-[200px] w-full px-4">{children}</div>
      </div>
    </div>
  );
}

export default BusinessLayout;
