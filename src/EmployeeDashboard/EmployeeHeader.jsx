import React, { useState, useEffect } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faClose } from "@fortawesome/free-solid-svg-icons";
import UserDetails from "./UserDetails";
import logo from "/logo192.png";
import NonTransferFile from "../Components/NonTranferFile";
import FileRequest from "../Components/FileRequest";
import TransferedFile from "../Components/TransferedFiles";
import EmployeeHome from "./EmployeeHome";
import Notification from "../Components/Notification";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFile } from "react-icons/fa";
import { AiFillAppstore } from "react-icons/ai";
import { IoIosNotifications } from "react-icons/io";
import { FiShieldOff } from "react-icons/fi";
import { MdOutlineTurnRight } from "react-icons/md";
import NonTransferFile3 from "../Components/NonTransfer3";

const EmployeHeader = () => {
  const [tab, setTab] = useState("notification");
  const [menue, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const level = localStorage.getItem("level");
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setMenu(false);
  };

  // Reusable NavItem component for both mobile and desktop
  const NavItem = ({ onClick, isActive, icon, label }) => {
    return (
      <div
        onClick={onClick}
        className={`cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-[#E68332] text-white"
            : "text-black hover:bg-[#E68332] hover:text-white"
        } font-normal text-lg px-3 my-3 py-2 rounded-md flex items-center gap-2`}
      >
        {icon}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row w-full relative">
      {/* Large Screen Sidebar - hidden on mobile */}
      <div className="h-screen rounded-lg left-0 sticky w-[17%] top-0 z-10 hidden md:flex flex-col justify-between bg-[#e7e6e4] p-2 shadow-md">
        <div className="h-[94%] md:flex flex-col justify-between">
          <div className="mt-6 text-left ml-2 font-normal text-gray-900">
            <div className="flex justify-center items-center pt-2">
              <img
                src={logo}
                className="w-16 h-16 object-cover rounded-full cursor-pointer"
                alt="Logo"
              />
            </div>
            {level === "1" && (
              <NavItem
                className="text-md font-normal"
                onClick={() => setTab("uploadTippani")}
                isActive={tab === "uploadTippani"}
                icon={<FaFile className="text-lg font-normal" />}
                label="फाइल अपलोड"
              />
            )}
            <NavItem
              onClick={() => setTab("veiwStatus")}
              isActive={tab === "veiwStatus"}
              icon={<AiFillAppstore className="text-lg" />}
              label="फाइलको स्थिति"
            />
            {level === "1" ? (
              <></>
            ) : (
              <>
                {level === "2" && (
                  <NavItem
                    onClick={() => setTab("nontransfer")}
                    isActive={tab === "nontransfer"}
                    icon={<FiShieldOff className="text-lg" />}
                    label="स्थानान्तरण नगरिएको फाइल"
                  />
                )}
                {(level === "3" || level === "4") && (
                  <NavItem
                    onClick={() => handleTabChange("nontransfer3")}
                    isActive={tab === "nontransfer3"}
                    icon={<FiShieldOff className="text-lg" />}
                    label="स्थानान्तरण नगरिएको फाइल "
                  />
                )}
                <NavItem
                  onClick={() => setTab("transfered")}
                  isActive={tab === "transfered"}
                  icon={<MdOutlineTurnRight className="text-2xl" />}
                  label="स्थानान्तरण गरिएको फाइल"
                />
                <NavItem
                  onClick={() => setTab("filerequest")}
                  isActive={tab === "filerequest"}
                  icon={<FaFile className="text-lg" />}
                  label="फाइल अनुरोध"
                />
              </>
            )}
            <NavItem
              onClick={() => setTab("notification")}
              isActive={tab === "notification"}
              icon={<IoIosNotifications className="text-2xl" />}
              label="सूचना"
            />
          </div>
          <div className="flex items-end justify-center mt-7">
            <UserDetails />
          </div>
        </div>
      </div>

      {/* Mobile Header - only visible on small screens */}
      <div className="sticky top-0 z-20 md:hidden w-full bg-[#e7e6e4] shadow-md">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <img
              src={logo}
              className="w-10 h-10 object-cover rounded-full"
              alt="Logo"
            />
          </div>
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl text-[#E68332] cursor-pointer"
            onClick={() => setMenu(true)}
          />
        </div>
      </div>

      {/* Mobile Slide-in Menu - appears only when menu state is true */}
      {menue && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMenu(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-screen bg-[#e7e6e4] z-40 transition-all duration-300 ease-in-out shadow-xl md:hidden ${
          menue ? "w-64" : "w-0 opacity-0"
        }`}
      >
        <div className="p-4 flex justify-end">
          <FontAwesomeIcon
            icon={faClose}
            className="text-2xl text-[#E68332] cursor-pointer"
            onClick={() => setMenu(false)}
          />
        </div>

        <div className="flex flex-col items-center">
          <img
            src={logo}
            className="w-16 h-16 object-cover rounded-full"
            alt="Logo"
          />
          <div className="mt-4">
            <UserDetails />
          </div>
        </div>

        <div className="flex flex-col mt-6 px-4 text-gray-900">
          {level === "1" && (
            <NavItem
              onClick={() => handleTabChange("uploadTippani")}
              isActive={tab === "uploadTippani"}
              icon={<FaFile className="text-lg" />}
              label="फाइल अपलोड"
            />
          )}
          <NavItem
            onClick={() => handleTabChange("veiwStatus")}
            isActive={tab === "veiwStatus"}
            icon={<AiFillAppstore className="text-lg" />}
            label="फाइलको स्थिति"
          />
          <NavItem
            onClick={() => handleTabChange("notification")}
            isActive={tab === "notification"}
            icon={<IoIosNotifications className="text-2xl" />}
            label="सूचना"
          />
          {level === "1" ? (
            <></>
          ) : (
            <>
              {level === "2" && (
                <NavItem
                  onClick={() => handleTabChange("nontransfer")}
                  isActive={tab === "nontransfer"}
                  icon={<FiShieldOff className="text-lg" />}
                  label="स्थानान्तरण नगरिएको फाइल"
                />
              )}
              {level === "3" && (
                <NavItem
                  onClick={() => handleTabChange("nontransfer3")}
                  isActive={tab === "nontransfer3"}
                  icon={<FiShieldOff className="text-lg" />}
                  label="स्थानान्तरण नगरिएको फाइल"
                />
              )}
              <NavItem
                onClick={() => handleTabChange("transfered")}
                isActive={tab === "transfered"}
                icon={<MdOutlineTurnRight className="text-2xl" />}
                label="स्थानान्तरण गरिएको फाइल"
              />
              <NavItem
                onClick={() => handleTabChange("filerequest")}
                isActive={tab === "filerequest"}
                icon={<FaFile className="text-lg" />}
                label="फाइल अनुरोध"
              />
            </>
          )}
        </div>
      </div>

      {/* Content Area - takes full width on mobile, partial width on desktop */}
      <div className="w-full md:w-[83%] flex flex-col p-4">
        {tab === "uploadTippani" && <UploadTipanni />}
        {tab === "veiwStatus" && <FileStatus />}
        {tab === "nontransfer" && <NonTransferFile />}
        {tab === "filerequest" && <FileRequest />}
        {tab === "employeehome" && <EmployeeHome />}
        {tab === "notification" && <Notification />}
        {tab === "transfered" && <TransferedFile />}
        {tab === "nontransfer3" && <NonTransferFile3 />}
      </div>
    </div>
  );
};

export default EmployeHeader;
