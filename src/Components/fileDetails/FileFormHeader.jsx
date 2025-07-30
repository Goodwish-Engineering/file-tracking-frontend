import React from 'react';
import { LABELS } from '../../constants/fileDetailsConstants';

const FileFormHeader = () => {
  return (
    <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-8 border-l-4 border-[#ED772F]">
      <h1 className="text-center text-2xl md:text-3xl font-bold mb-3 text-[#ED772F]">
        {LABELS.FORM_TITLE}
      </h1>
      <div className="flex md:flex-row flex-col gap-2">
        <p className="text-red-500 text-lg font-normal text-center">
          {LABELS.FORM_SUBTITLE_NEPALI}
        </p>
        <p className="text-gray-600 text-lg font-normal text-center">
          {LABELS.FORM_SUBTITLE_ENGLISH}
        </p>
      </div>
    </div>
  );
};

export default FileFormHeader;
