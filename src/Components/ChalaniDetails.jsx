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
  FaPaperPlane,
} from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { MdSubject } from "react-icons/md";

const ChalaniDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [chalaniRecord, setChalaniRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChalaniDetails();
  }, [id]);

  const fetchChalaniDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/chalani/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chalani details");
      }

      const data = await response.json();
      setChalaniRecord(data);
    } catch (error) {
      console.error("Error fetching chalani details:", error);
      setError("चलानी रेकर्डको विवरण लोड गर्न असफल भयो।");
      toast.error("चलानी रेकर्डको विवरण लोड गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        {icon && <span className="mr-2 text-blue-500">{icon}</span>}
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
          <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4 mx-auto" />
          <p className="text-gray-600">चलानी रेकर्डको विवरण लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error || !chalaniRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">त्रुटि भयो</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            चलानी रेकर्ड विवरण
          </h1>
          <p className="text-gray-600">
            चलानी नम्बर: <span className="font-semibold">{chalaniRecord.chalani_number}</span>
          </p>
        </div>
      </div>

      {/* Content Grid */}
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
          <InfoItem
            label="सम्बन्धित फाँट"
            value={chalaniRecord.related_faat}
            icon={<FaBuilding />}
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

      {/* Timestamp Information */}
      <div className="mt-6">
        <InfoCard title="समय जानकारी" icon={<FaCalendarAlt />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="सिर्जना मिति"
              value={chalaniRecord.created_at ? new Date(chalaniRecord.created_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
            />
            <InfoItem
              label="अन्तिम अपडेट"
              value={chalaniRecord.updated_at ? new Date(chalaniRecord.updated_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
            />
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default ChalaniDetails;
