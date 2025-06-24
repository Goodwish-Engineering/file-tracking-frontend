import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaSpinner,
  FaEdit,
  FaPrint,
  FaCalendarAlt,
} from "react-icons/fa";
import DartaViewDetails from "./DartaViewDetails";
import DartaEditForm from "./DartaEditForm";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";

const DartaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [dartaRecord, setDartaRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch darta details when component mounts
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({
      darta_date: dartaRecord.darta_date || '',
      patra_sankhya: dartaRecord.patra_sankhya || '',
      patra_miti: dartaRecord.patra_miti || '',
      chalani_number: dartaRecord.chalani_number || '',
      subject: dartaRecord.subject || '',
      remarks: dartaRecord.remarks || '',
      tok_aadesh_dine: dartaRecord.tok_aadesh_dine || '',
      pana_sankhya: dartaRecord.pana_sankhya || '',
      patra_bujaune_faat: dartaRecord.patra_bujaune_faat || '',
      karmachari: dartaRecord.karmachari || '',
      related_office: dartaRecord.related_office || '',
      related_department: dartaRecord.related_department || '',
      related_faat: dartaRecord.related_faat || '',
      related_file: dartaRecord.related_file || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`${baseUrl}/darta/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error('दर्ता रेकर्ड अपडेट गर्न असफल भयो');
      }

      const updatedData = await response.json();
      setDartaRecord(updatedData);
      setIsEditing(false);
      toast.success('दर्ता रेकर्ड सफलतापूर्वक अपडेट भयो!');
    } catch (error) {
      console.error('Error updating darta record:', error);
      toast.error('दर्ता रेकर्ड अपडेट गर्न असफल भयो।');
    } finally {
      setUpdateLoading(false);
    }
  };

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
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={updateLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                  {updateLoading ? 'सुरक्षित गर्दै...' : 'सुरक्षित गर्नुहोस्'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  रद्द गर्नुहोस्
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit />
                  सम्पादन गर्नुहोस्
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FaPrint />
                  प्रिन्ट गर्नुहोस्
                </button>
              </>
            )}
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

      {/* Content Grid - Choose between view or edit mode */}
      {isEditing ? (
        <DartaEditForm
          dartaRecord={dartaRecord}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          updateLoading={updateLoading}
        />
      ) : (
        <DartaViewDetails dartaRecord={dartaRecord} />
      )}

      {/* Timestamp Information */}
      <div className="mt-6">
        <InfoCard title="समय जानकारी" icon={<FaCalendarAlt />} borderColor="[#E68332]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="सिर्जना मिति"
              value={dartaRecord.created_at ? new Date(dartaRecord.created_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
              primaryColor="[#E68332]"
            />
            <InfoItem
              label="अन्तिम अपडेट"
              value={dartaRecord.updated_at ? new Date(dartaRecord.updated_at).toLocaleString('ne-NP') : null}
              icon={<FaCalendarAlt />}
              primaryColor="[#E68332]"
            />
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default DartaDetails;