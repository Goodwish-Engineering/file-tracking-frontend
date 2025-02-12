import React, { useState } from "react";
import EmployeeDetails from "./EmployeeDetails";

import FileProgress from "./FileProgress";
import Registration from "../Components/Register";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [tab, setTab] = useState("empdetails");
  const [menue, setMeue] = useState(false);

  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-[80%]  flex flex-col h-screen overflow-auto ">
        {tab == "empdetails" && <EmployeeDetails />}
        {tab == "filedetails" && <FileProgress />}
        {tab == "register" && <Registration />}
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
            <img
              src="https://media.istockphoto.com/id/2077308984/photo/business-person-working-in-office.jpg?s=2048x2048&w=is&k=20&c=tBfZHN3wIr79xpfM4ZEmDZlkjJ6RYS8ThJSVVJ5EkFE="
              className="w-20 h-20 object-cover rounded-full"
            />
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
          </div>
        </div>
      )}
      <div className="w-[20%] h-screen hidden bg-orange-400 rounded-md md:flex flex-col gap-3 items-center py-3 ">
        <div className="w-full flex flex-col justify-center items-center">
          <img
            src="https://media.istockphoto.com/id/2077308984/photo/business-person-working-in-office.jpg?s=2048x2048&w=is&k=20&c=tBfZHN3wIr79xpfM4ZEmDZlkjJ6RYS8ThJSVVJ5EkFE="
            className="w-20 h-20 object-cover rounded-full"
          />
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
