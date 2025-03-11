import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const AdminHeader = () => {
  return (
    <>
      <Link to="/admindashboard">
        <button className="px-3 my-2 mx-2 rounded-md py-1 bg-[#E68332] flex items-center gap-2">
          <IoMdArrowRoundBack className="text-lg text-white" /> <span className="text-white text-lg font-semibold">Home</span>
        </button>
      </Link>
    </>
  );
};

export default AdminHeader;
