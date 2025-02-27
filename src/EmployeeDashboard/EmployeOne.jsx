import React, { useState } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faClose,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";

import logo from "/logo192.png";
import NonTransferFile from "../Components/NonTranferFile";
import Notification from "../Components/Notification";
import FileRequest from "../Components/FileRequest";
const EmployeOne = () => {
  const [tab, setTab] = useState("notification");
  const [menue, setMeue] = useState(false);
  // const level = localStorage.getItem("level"); // Retrieve inside useEffect
  // console.log(level);

  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-[80%]  flex flex-col h-screen overflow-auto ">
        {tab == "uploadTippani" && <UploadTipanni />}
        {tab == "veiwStatus" && <FileStatus />}
        {tab == "nontransfer" && <NonTransferFile />}
        {tab == "filerequest" && <FileRequest />}
        {tab == "notification" && <Notification />}
      </div>
      <div className="md:hidden lg:hidden fixed top-2 py-4 right-4">
        {menue ? (
          <FontAwesomeIcon
          className="text-2xl"
            icon={faClose}
            onClick={() => {
              setMeue(!menue);
            }}
          />
        ) : (
          <FontAwesomeIcon
          className="text-2xl"
            icon={faBars}
            onClick={() => {
              setMeue(!menue);
            }}
          />
        )}
      </div>
      {/* small screen */}
      {menue && (
        <div className="w-[50%] md:hidden lg:hidden bg-orange-400 h-screen fixed py-4 px-3">
          <div className="w-full flex flex-col justify-center items-center">
            <img src={logo} className="w-20 h-20 object-cover rounded-full" />
          </div>
          <div className="w-full flex flex-col gap-3 px-5 py-4 font-semibold text-white text-lg">
            {/* {level === "2" && ( */}
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
            {/* )} */}
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
            {/* {level === "2" ? ( */}
              <h3
                onClick={() => {
                  setMeue(false);
                  setTab("nontransfer");
                }}
                className={`w-full cursor-pointer   ${
                  tab == "nontransfer" && "bg-yellow-700"
                } hover:bg-yellow-700 px-3 py-1 rounded-md`}
              >
                Non-transfer file
              </h3>
            {/* ) : ( */}
              <h3
                onClick={() => {
                  setMeue(false);
                  setTab("filerequest");
                }}
                className={`w-full cursor-pointer   ${
                  tab == "filerequest" && "bg-yellow-700"
                } hover:bg-yellow-700 px-3 py-1 rounded-md`}
              >
                File Request
              </h3>
            {/* )} */}
            <button
              onClick={() => {
                setTab("notification");
              }}
              className={`w-full cursor-pointer   ${
                tab == "notification" && "bg-yellow-700"
              } hover:bg-yellow-700 flex gap-2 items-center px-3 py-1 rounded-md`}
            >
              <h3>Notification</h3> <FontAwesomeIcon icon={faBell} />
            </button>
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
      {/* large screen */}
      <div className="w-[20%] h-screen hidden bg-orange-400 px-2 z-30 md:flex flex-col gap-3 items-center py-3 ">
        <div className="w-full flex flex-col justify-center bg-white border-2 border-red-600 rounded-lg py-2  items-center">
          <img src={logo} className="w-20 h-20 object-cover rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-3 px-5 py-4 font-semibold text-white text-lg">
          {/* {level === "2" && ( */}
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
          {/* )} */}
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
          {/* {level === "2" ? ( */}
            <h3
              onClick={() => {
                setTab("nontransfer");
              }}
              className={`w-full cursor-pointer   ${
                tab == "nontransfer" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Non transfer file
            </h3>
          {/* ) : ( */}
            <h3
              onClick={() => {
                setTab("filerequest");
              }}
              className={`w-full cursor-pointer   ${
                tab == "filerequest" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              File Request
            </h3>
          {/* )} */}
          <button
            onClick={() => {
              setTab("notification");
            }}
            className={`w-full cursor-pointer   ${
              tab == "notification" && "bg-yellow-700"
            } hover:bg-yellow-700 flex gap-2 items-center px-3 py-1 rounded-md`}
          >
            <h3>Notification</h3> <FontAwesomeIcon icon={faBell} />
          </button>
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
