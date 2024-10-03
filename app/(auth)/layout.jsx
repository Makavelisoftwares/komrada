import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="flex  min-h-screen">
      <div className="md:w-[600px]  bg-amber-500"></div>
      <div className="flex items-center justify-center m-auto"> {children}</div>
    </div>
  );
}

export default AuthLayout;
