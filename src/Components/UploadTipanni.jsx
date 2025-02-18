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
          className="w-full py-2 flex justify-center cursor-pointer gap-3 bg-green-500 items-center text-white fixed top-0 "
        >
          <h1>Add New File</h1>
          <FontAwesomeIcon icon={faFile} />
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
