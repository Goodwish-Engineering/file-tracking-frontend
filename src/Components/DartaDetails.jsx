import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaBuilding,
  FaUser,
  FaArrowLeft,
  FaSpinner,
  FaEdit,
  FaPrint,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";

const DartaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [dartaRecord, setDartaRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDartaDetails();
  }, [id]);

  const fetchDartaDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/darta/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch darta details");
      }

      const data = await response.json();
      setDartaRecord(data);
    } catch (error) {
      console.error("Error fetching darta details:", error);
      setError("दर्ता रेकर्डको विवरण लोड गर्न असफल भयो।");
      toast.error("दर्ता रेकर्डको विवरण लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#E68332] hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, icon }) => (
    <div className="flex items-start">
      <div className="flex items-center min-w-0 flex-1">
        {icon && <span className="mr-2 text-gray-400 flex-shrink-0">{icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-sm text-gray-900 break-words">{value || "उपलब्ध छैन"}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-[#E68332] mb-4 mx-auto" />
          <p className="text-gray-600">दर्ता रेकर्डको विवरण लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !dartaRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">त्रुटि भयो</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#E68332] text-white rounded-lg hover:bg-[#c36f2a] transition-colors"
          >
            फिर्ता जानुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft />
            फिर्ता जानुहोस्
          </button>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaEdit />
              सम्पादन गर्नुहोस्
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <FaPrint />
              प्रिन्ट गर्नुहोस्
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-6 rounded-lg border-l-4 border-[#E68332]">
          <h1 className="text-3xl font-bold text-[#E68332] mb-2">
            दर्ता रेकर्ड विवरण
          </h1>
          <p className="text-gray-600">
            दर्ता नम्बर: <span className="font-semibold">{dartaRecord.darta_number}</span>
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <InfoCard title="आधारभूत जानकारी" icon={<BsFileEarmark />}>
          <InfoItem
            label="दर्ता नम्बर"
            value={dartaRecord.darta_number}
            icon={<FaFileAlt />}
          />
          <InfoItem
            label="दर्ता मिति"
            value={dartaRecord.darta_date}
            icon={<FaCalendarAlt />}
          />
          <InfoItem
            label="पत्र संख्या"
            value={dartaRecord.patra_sankhya}
            icon={<FaFileAlt />}
          />
          <InfoItem
            label="पत्र मिति"
            value={dartaRecord.patra_miti}
            icon={<FaCalendarAlt />}
          />
          <InfoItem
            label="चलानी नम्बर"
            value={dartaRecord.chalani_number}
            icon={<FaFileAlt />}
          />
        </InfoCard>

        {/* Office Information */}
        <InfoCard title="कार्यालय जानकारी" icon={<FaBuilding />}>
          <InfoItem
            label="सम्बन्धित विभाग"
            value={dartaRecord.related_department_detail?.name}
            icon={<FaBuilding />}
          />
          <InfoItem
            label="सम्बन्धित कार्यालय"
            value={dartaRecord.related_office_detail?.name}
            icon={<FaBuilding />}
          />
          <InfoItem
            label="सम्बन्धित फाँट"
            value={dartaRecord.related_faat_detail?.name}
            icon={<FaBuilding />}
          />
          <InfoItem
            label="पठाउने विभाग"
            value={dartaRecord.sending_department_detail?.name}
            icon={<FaBuilding />}
          />
        </InfoCard>

        {/* Subject and Description */}
        <InfoCard title="विषय र विवरण" icon={<MdSubject />}>
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
        <InfoCard title="अन्य विवरणहरू" icon={<FaUser />}>
          <InfoItem
            label="टोक आदेश दिने"
            value={dartaRecord.tok_aadesh_dine}
            icon={<FaUser />}
          />
          <InfoItem
            label="पाना संख्या"
            value={dartaRecord.pana_sankhya}
            icon={<FaFileAlt />}
          />
          <InfoItem
            label="पत्र बुझाउने फाँट"
            value={dartaRecord.patra_bujaune_faat}
            icon={<FaBuilding />}
          />
          <InfoItem
            label="कर्मचारी"
            value={dartaRecord.karmachari}
            icon={<FaUser />}
          />
        </InfoCard>

        {/* File Information */}
        {dartaRecord.related_file_detail && (
          <div className="lg:col-span-2">
            <InfoCard title="सम्बन्धित फाइल जानकारी" icon={<FaFileAlt />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  label="फाइल नाम"
                  value={dartaRecord.related_file_detail.file_name}
                  icon={<FaFileAlt />}
                />
                <InfoItem
                  label="फाइल कोड"
                  value={dartaRecord.related_file_detail.file_code}
                  icon={<FaFileAlt />}
                />
                <InfoItem
                  label="फाइल ID"
                  value={dartaRecord.related_file_detail.id}
                  icon={<FaFileAlt />}
                />
                <InfoItem
                  label="स्थिति"
                  value={dartaRecord.related_file_detail.is_disabled ? "असक्षम" : "सक्षम"}
                  icon={<FaFileAlt />}
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

      {/* Timestamp Information */}
      <div className="mt-6">
        <InfoCard title="समय जानकारी" icon={<FaCalendarAlt />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="सिर्जना मिति"
              value={dartaRecord.created_at ? new Date(dartaRecord.created_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
            />
            <InfoItem
              label="अन्तिम अपडेट"
              value={dartaRecord.updated_at ? new Date(dartaRecord.updated_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
            />
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default DartaDetails;
