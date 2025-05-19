import React, { useEffect, useState } from "react";
import FileDetails from "./FileDetails";
import PanjikaDocumentsForm from "./PanikajDocumentForm";
import PanjikaTippani from "./PanjikaTippani";
import LandDetailsForm from "./LandDetailsForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const UploadTipanni = ({ fileType }) => {
  const [showButton, setShowButton] = useState(false);
  const [clearData, setClearData] = useState(1);
  const [showLandForm, setShowLandForm] = useState(false);
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
          <button className="cursor-pointer px-3 py-1 md:mt-2 mt-8 right-2 top-12 bg-[#E68332] rounded-lg text-white fixed md:top-3 ">नयाँ फाइल थप्नुहोस्</button>
          {/* <FontAwesomeIcon icon={faFile} /> */}
        </div>
      )}
      <FileDetails setShowButton={setShowButton} clearData={clearData} fileType={fileType} />
      {showButton && (
        <div className="w-full flex flex-col gap-2">
          <PanjikaTippani />
          <PanjikaDocumentsForm />
          {!showLandForm && (
            <div className="flex justify-end">
              <button
                className="mt-2 px-4 py-2 bg-[#E68332] text-white rounded hover:bg-[#c36f2a]"
                onClick={() => setShowLandForm(true)}
              >
                नयाँ जग्गा विवरण थप्नुहोस्
              </button>
            </div>
          )}
          {showLandForm && <LandDetailsForm onSuccess={() => setShowLandForm(false)} />}
        </div>
      )}
    </div>
  );
};

export default UploadTipanni;
