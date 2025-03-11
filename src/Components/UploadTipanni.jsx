import React, { useEffect, useState } from "react";
import FileDetails from "./FileDetails";
import PanjikaDocumentsForm from "./PanikajDocumentForm";
import PanjikaTippani from "./PanjikaTippani";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const UploadTipanni = () => {
  const [showButton, setShowButton] = useState(false);
  const [clearData, setClearData] = useState(1);
  useEffect(() => {
    setShowButton(false);
  }, []);
  const handleNewFile = () => {
    setShowButton(false);
    setClearData(clearData + 1);
  };
  return (
    <div>
      {showButton && (
        <div
          onClick={() => {
            handleNewFile();
          }}
          className="flex items-end justify-end "
        >
          <button className="cursor-pointer px-3 py-1 right-1 bg-[#E68332] rounded-lg text-white fixed top-3 ">Add New file</button>
          {/* <FontAwesomeIcon icon={faFile} /> */}
        </div>
      )}
      <FileDetails setShowButton={setShowButton} clearData={clearData} />
      {showButton && (
        <div className="w-full flex flex-col gap-2">
          <PanjikaTippani />
          <PanjikaDocumentsForm />
        </div>
      )}
    </div>
  );
};

export default UploadTipanni;
