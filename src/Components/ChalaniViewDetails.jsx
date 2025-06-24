import React from "react";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";
import { 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBuilding, 
  FaUser, 
  FaPaperPlane, 
  FaEye,
  FaDownload
} from "react-icons/fa";
import { MdSubject } from "react-icons/md";

const ChalaniViewDetails = ({ chalaniRecord }) => {
  if (!chalaniRecord) return null;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Information */}
      <InfoCard title="आधारभूत जानकारी" icon={<FaPaperPlane />}>
        <InfoItem
          label="चलानी नम्बर"
          value={chalaniRecord.chalani_number}
          icon={<FaFileAlt />}
        />
        <InfoItem
          label="चलानी मिति"
          value={chalaniRecord.chalani_date}
          icon={<FaCalendarAlt />}
        />
        <InfoItem
          label="दर्ता नम्बर"
          value={chalaniRecord.darta_number}
          icon={<FaFileAlt />}
        />
        <InfoItem
          label="दर्ता मिति"
          value={chalaniRecord.darta_date}
          icon={<FaCalendarAlt />}
        />
        <InfoItem
          label="पत्र संख्या"
          value={chalaniRecord.patra_sankhya}
          icon={<FaFileAlt />}
        />
      </InfoCard>

      {/* Office Information */}
      <InfoCard title="कार्यालय जानकारी" icon={<FaBuilding />}>
        <InfoItem
          label="सम्बन्धित विभाग"
          value={chalaniRecord.related_department_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="सम्बन्धित कार्यालय"
          value={chalaniRecord.related_office_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="सम्बन्धित फाँट"
          value={chalaniRecord.related_faat_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="पठाउने विभाग"
          value={chalaniRecord.sending_department_detail?.name}
          icon={<FaBuilding />}
        />
        <InfoItem
          label="पठाउने स्थान"
          value={chalaniRecord.pathaaune_thau}
          icon={<FaPaperPlane />}
        />
        <InfoItem
          label="प्राप्त गर्ने व्यक्ति"
          value={chalaniRecord.prapta_garne_byakti}
          icon={<FaUser />}
        />
      </InfoCard>

      {/* Subject and Description */}
      <InfoCard title="विषय र विवरण" icon={<MdSubject />}>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">विषय</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {chalaniRecord.subject || "विषय उपलब्ध छैन"}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">कैफियत</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {chalaniRecord.remarks || "कैफियत उपलब्ध छैन"}
              </p>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Additional Details */}
      <InfoCard title="अन्य विवरणहरू" icon={<FaUser />}>
        <InfoItem
          label="कर्मचारी"
          value={chalaniRecord.karmachari}
          icon={<FaUser />}
        />
        <InfoItem
          label="पाना संख्या"
          value={chalaniRecord.pana_sankhya}
          icon={<FaFileAlt />}
        />
      </InfoCard>

      {/* File Information */}
      {chalaniRecord.related_file_detail && (
        <div className="lg:col-span-2">
          <InfoCard title="सम्बन्धित फाइल जानकारी" icon={<FaFileAlt />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label="फाइल नाम"
                value={chalaniRecord.related_file_detail.file_name}
                icon={<FaFileAlt />}
              />
              <InfoItem
                label="फाइल कोड"
                value={chalaniRecord.related_file_detail.file_code}
                icon={<FaFileAlt />}
              />
              <InfoItem
                label="फाइल ID"
                value={chalaniRecord.related_file_detail.id}
                icon={<FaFileAlt />}
              />
              <InfoItem
                label="स्थिति"
                value={chalaniRecord.related_file_detail.is_disabled ? "असक्षम" : "सक्षम"}
                icon={<FaFileAlt />}
              />
            </div>
            
            {chalaniRecord.related_file_detail.file_url && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.open(chalaniRecord.related_file_detail.file_url, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEye />
                  फाइल हेर्नुहोस्
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = chalaniRecord.related_file_detail.file_url;
                    link.download = chalaniRecord.related_file_detail.file_name;
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

export default ChalaniViewDetails;
