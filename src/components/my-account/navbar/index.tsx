import React from "react";
import CommonNavbar from "@/components/ui/navbar";

const Navbar = () => {
  return (
    <div className="bg-blue-500 py-4 px-7 w-full 2xl:px-0 z-10 relative">
      <CommonNavbar variant="dark" className="max-w-screen-xl mx-auto" />
    </div>
  );
};

export default Navbar;
