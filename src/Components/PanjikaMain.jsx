import React from "react";
import FileDetails from "./FileDetails";
import PanjikaDocumentsForm from "./PanikajDocumentForm";
import PanjikaForm from "./PanjikaForm";
import { useSelector } from "react-redux";

const PanjikaMain = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  console.log(baseUrl);
  return (
    <div className="w-full flex gap-10 flex-col bg-yellow- ">
      <div className="w-full flex justify-center items-center flex-col gap-2">
        <h1 className="text-4xl font-semibold">Guthi Sansthan</h1>
        <p className="text-semibold">
          Purbhadhar thatha sampada samrakxyan sakha
        </p>
      </div>
      <FileDetails baseUrl={baseUrl} />
      <PanjikaDocumentsForm baseUrl={baseUrl} />
      <PanjikaForm baseUrl={baseUrl} />
    </div>
  );
};

export default PanjikaMain;
