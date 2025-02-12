import React, { useState } from "react";
import UploadTipanni from "../Components/UploadTipanni";
import FileStatus from "../Components/FileStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import NonTransferFile from "../Components/NonTransferFile";

const EmployeOne = () => {
  const [tab, setTab] = useState("uploadTippani");
  const [menue, setMeue] = useState(false);
  return (
    <div className="flex w-full h-screen">
      <div className="w-full md:w-[80%]  flex flex-col h-screen overflow-auto ">
        {tab == "uploadTippani" && <UploadTipanni />}
        {tab == "veiwStatus" && <FileStatus />}
        {tab == "non-transfer" && <NonTransferFile />}
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
                setTab("uploadTippani");
              }}
              className={`w-full cursor-pointer ${
                tab == "uploadTippani" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Upload Tippani
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
            <h3
              onClick={() => {
                setMeue(false);
                setTab("profile");
              }}
              className={`w-full cursor-pointer ${
                tab == "profile" && "bg-yellow-700"
              } hover:bg-yellow-700 px-3 py-1 rounded-md`}
            >
              Profile
            </h3>
          </div>
        </div>
      )}
      <div className="w-[20%] h-screen hidden bg-yellow-600 rounded-md md:flex flex-col gap-3 items-center py-3 ">
        <div className="w-full flex flex-col justify-center items-center">
          <img
            src="https://media.istockphoto.com/id/2077308984/photo/business-person-working-in-office.jpg?s=2048x2048&w=is&k=20&c=tBfZHN3wIr79xpfM4ZEmDZlkjJ6RYS8ThJSVVJ5EkFE="
            className="w-20 h-20 object-cover rounded-full"
          />
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
            Upload Tippani
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
          <h3
            onClick={() => {
              setTab("non-transfer");
            }}
            className={`w-full cursor-pointer   ${
              tab == "non-transfer" && "bg-yellow-700"
            } hover:bg-yellow-700 px-3 py-1 rounded-md`}
          >
            Non-Transfer files
          </h3>
        </div>
      </div>
    </div>
  );
};

export default EmployeOne;
