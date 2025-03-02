import React from "react";
import homeimg from "../image/homeimg.png";

const EmployeeHome = () => {
  return (
    <div className="bg-orange-50">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 flex justify-start items-center p-4 mt-2 md:mt-2">
          <div>
            <p className="text-black font-normal text-xl lg:ml-10 md:ml-10 ml-3">
              A File Tracking System (FTS) is a digital solution that helps
              manage, monitor, and track files efficiently. When integrated into
              a landing page, an FTS can provide real-time tracking of uploaded,
              downloaded, or modified files, ensuring security, transparency,
              and efficient document management.
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center p-4">
          <img
            // src={homeimg}
            alt="image"
            className="h-auto md:h-96 mt-10 md:mt-0 max-w-full mx-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
