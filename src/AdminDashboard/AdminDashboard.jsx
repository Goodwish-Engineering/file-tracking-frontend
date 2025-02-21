import React, { useState } from "react";
import EmployeeDetails from "./EmployeeDetails";
import Registration from "../Components/Register";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faClose,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import FileStatus from "../Components/FileStatus";
import logo from "/logo192.png";
import Notification from "../Components/Notification";
const AdminDashboard = () => {
  const [tab, setTab] = useState("empdetails");
  const [menue, setMeue] = useState(false);

  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-[80%]  flex flex-col h-screen overflow-auto ">
        {tab == "empdetails" && <EmployeeDetails />}
        {tab == "filedetails" && <FileStatus />}
        {tab == "register" && <Registration />}
        {tab == "notification" && <Notification />}
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
                setTab("empdetails");
              }}
              className={`w-full cursor-pointer ${
                tab == "empdetails" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Employee details
            </h3>
            <h3
              onClick={() => {
                setMeue(false);
                setTab("filedetails");
              }}
              className={`w-full cursor-pointer   ${
                tab == "filedetails" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              File details
            </h3>
            <h3
              onClick={() => {
                setMeue(false);
                setTab("register");
              }}
              className={`w-full cursor-pointer ${
                tab == "register" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Employee Register
            </h3>
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
      <div className="w-[20%] h-screen hidden bg-orange-400 rounded-md md:flex flex-col gap-3 items-center py-3 ">
        <div className="w-full flex flex-col justify-center bg-white border-2 border-red-600 rounded-lg py-2  items-center">
          <img src={logo} className="w-20 h-20 object-cover rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-3 px-5 py-4 font-semibold text-white text-lg">
          <h3
            onClick={() => {
              setTab("empdetails");
            }}
            className={`w-full cursor-pointer ${
              tab == "empdetails" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            Employee details
          </h3>
          <h3
            onClick={() => {
              setTab("filedetails");
            }}
            className={`w-full cursor-pointer   ${
              tab == "filedetails" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            File details
          </h3>
          <h3
            onClick={() => {
              setTab("register");
            }}
            className={`w-full cursor-pointer ${
              tab == "register" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            Employee Register
          </h3>
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

export default AdminDashboard;
