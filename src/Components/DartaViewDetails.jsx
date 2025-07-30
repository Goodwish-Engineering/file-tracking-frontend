import React from "react";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";
import { 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBuilding, 
  FaUser, 
  FaEye,
  FaDownload,
  FaMapMarkerAlt
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";

const DartaViewDetails = ({ dartaRecord }) => {
  if (!dartaRecord) return null;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <InfoCard title="आधारभूत जानकारी" icon={<BsFileEarmark />} borderColor="[#E68332]">
        <InfoItem
          label="दर्ता नम्बर"
          value={dartaRecord.darta_number}
          icon={<FaFileAlt />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="दर्ता मिति"
          value={dartaRecord.darta_date}
          icon={<FaCalendarAlt />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पाना संख्या"
          value={dartaRecord.pana_sankhya}
          icon={<FaFileAlt />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पठाउने व्यक्ति"
          value={dartaRecord.sender_name}
          icon={<FaUser />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पठाउने ठेगाना"
          value={dartaRecord.sender_address}
          icon={<FaMapMarkerAlt />}
          primaryColor="[#E68332]"
        />
      </InfoCard>

      {/* Office Information */}
      <InfoCard title="कार्यालय जानकारी" icon={<FaBuilding />} borderColor="[#E68332]">
        <InfoItem
          label="सम्बन्धित विभाग"
          value={dartaRecord.related_department_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="सम्बन्धित कार्यालय"
          value={dartaRecord.related_office_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="सम्बन्धित फाँट"
          value={dartaRecord.related_faat_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पठाउने विभाग"
          value={dartaRecord.sending_department_detail?.name}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
      </InfoCard>

      {/* Subject and Description */}
      <InfoCard title="विषय र विवरण" icon={<MdSubject />} borderColor="[#E68332]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">विषय</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {dartaRecord.subject || "विषय उपलब्ध छैन"}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">कैफियत</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {dartaRecord.remarks || "कैफियत उपलब्ध छैन"}
              </p>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Additional Details */}
      <InfoCard title="अन्य विवरणहरू" icon={<FaUser />} borderColor="[#E68332]">
        <InfoItem
          label="टोक आदेश दिने"
          value={dartaRecord.tok_aadesh_dine}
          icon={<FaUser />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पाना संख्या"
          value={dartaRecord.pana_sankhya}
          icon={<FaFileAlt />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="पत्र बुझाउने फाँट"
          value={dartaRecord.patra_bujaune_faat}
          icon={<FaBuilding />}
          primaryColor="[#E68332]"
        />
        <InfoItem
          label="कर्मचारी"
          value={dartaRecord.karmachari}
          icon={<FaUser />}
          primaryColor="[#E68332]"
        />
      </InfoCard>

      {/* File Information */}
      {dartaRecord.related_file_detail && (
        <div className="lg:col-span-2">
          <InfoCard title="सम्बन्धित फाइल जानकारी" icon={<FaFileAlt />} borderColor="[#E68332]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="फाइल नाम"
                value={dartaRecord.related_file_detail.file_name}
                icon={<FaFileAlt />}
                primaryColor="[#E68332]"
              />
              <InfoItem
                label="फाइल कोड"
                value={dartaRecord.related_file_detail.file_code}
                icon={<FaFileAlt />}
                primaryColor="[#E68332]"
              />
              <InfoItem
                label="फाइल ID"
                value={dartaRecord.related_file_detail.id}
                icon={<FaFileAlt />}
                primaryColor="[#E68332]"
              />
              <InfoItem
                label="स्थिति"
                value={dartaRecord.related_file_detail.is_disabled ? "असक्षम" : "सक्षम"}
                icon={<FaFileAlt />}
                primaryColor="[#E68332]"
              />
            </div>
            
            {dartaRecord.related_file_detail.file_url && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open(dartaRecord.related_file_detail.file_url, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEye />
                  फाइल हेर्नुहोस्
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = dartaRecord.related_file_detail.file_url;
                    link.download = dartaRecord.related_file_detail.file_name;
                    link.click();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaDownload />
                  डाउनलोड गर्नुहोस्
                </button>
              </div>
            )}
          </InfoCard>
        </div>
      )}
    </div>
  );
};

export default DartaViewDetails;
