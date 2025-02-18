import React, { useState } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faSignOut } from "@fortawesome/free-solid-svg-icons";

import logo from "/logo192.png";
const EmployeOne = () => {
  const [tab, setTab] = useState("uploadTippani");
  const [menue, setMeue] = useState(false);
  const level = localStorage.getItem("level"); // Retrieve inside useEffect

  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-[80%]  flex flex-col h-screen overflow-auto ">
        {tab == "uploadTippani" && <UploadTipanni />}
        {tab == "veiwStatus" && <FileStatus />}
      </div>
      <div className="md:hidden fixed top-2 right-4">
        {menue ? (
          <FontAwesomeIcon
            icon={faClose}
            onClick={() => {
              setMeue(!menue);
            }}
          />
        ) : (
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => {
              setMeue(!menue);
            }}
          />
        )}
      </div>
      {menue && (
        <div className="w-[50%] bg-orange-400 h-screen fixed py-4">
          <div className="w-full flex flex-col justify-center items-center">
            <img src={logo} className="w-20 h-20 object-cover rounded-full" />
          </div>
          <div className="w-full flex flex-col gap-3 px-5 py-4 font-semibold text-white text-lg">
            <h3
              onClick={() => {
                setMeue(false);
                setTab("uploadTippani");
              }}
              className={`w-full cursor-pointer ${
                tab == "uploadTippani" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Upload File
            </h3>
            <h3
              onClick={() => {
                setMeue(false);
                setTab("veiwStatus");
              }}
              className={`w-full cursor-pointer   ${
                tab == "veiwStatus" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              File status
            </h3>
          </div>
          <div>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full px-10 py-2 rounded-md  mt-40 bg-gray-300/60 flex items-center justify-center text-white font-semibold gap-3 hover:bg-orange-950"
            >
              <h4>Log Out</h4>
              <FontAwesomeIcon icon={faSignOut} />
            </button>
          </div>
        </div>
      )}
      <div className="w-[20%] h-screen hidden bg-orange-400 px-2 rounded-md  md:flex flex-col gap-3 items-center py-3 ">
        <div className="w-full flex flex-col justify-center bg-white border-2 border-red-600 rounded-lg py-2  items-center">
          <img src={logo} className="w-20 h-20 object-cover rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-3 px-5 py-4 font-semibold text-white text-lg">
          <h3
            onClick={() => {
              setTab("uploadTippani");
            }}
            className={`w-full cursor-pointer ${
              tab == "uploadTippani" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            Upload File
          </h3>
          <h3
            onClick={() => {
              setTab("veiwStatus");
            }}
            className={`w-full cursor-pointer   ${
              tab == "veiwStatus" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            File Status
          </h3>
        </div>
        <div>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="w-full px-10 py-2 rounded-md  mt-40 bg-gray-300/60 flex items-center justify-center text-white font-semibold gap-3 hover:bg-orange-950"
          >
            <h4>Log Out</h4>
            <FontAwesomeIcon icon={faSignOut} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeOne;
