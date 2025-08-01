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
import ChalaniViewDetails from "./ChalaniViewDetails";
import ChalaniEditForm from "./ChalaniEditForm";
import InfoCard from "./Common/InfoCard";
import InfoItem from "./Common/InfoItem";

const ChalaniDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");

  const [chalaniRecord, setChalaniRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch chalani details when component mounts
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditFormData({
      chalani_date: chalaniRecord.chalani_date || "",
      darta_date: chalaniRecord.darta_date || "",
      patra_sankhya: chalaniRecord.patra_sankhya || "",
      subject: chalaniRecord.subject || "",
      remarks: chalaniRecord.remarks || "",
      karmachari: chalaniRecord.karmachari || "",
      pana_sankhya: chalaniRecord.pana_sankhya || "",
      pathaaune_thau: chalaniRecord.pathaaune_thau || "",
      prapta_garne_byakti: chalaniRecord.prapta_garne_byakti || "",
      related_office: chalaniRecord.related_office || "",
      related_department: chalaniRecord.related_department || "",
      related_faat: chalaniRecord.related_faat || "",
      related_file: chalaniRecord.related_file || "",
      sending_department: chalaniRecord.sending_department || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`${baseUrl}/chalani/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        throw new Error("चलानी रेकर्ड अपडेट गर्न असफल भयो");
      }

      const updatedData = await response.json();
      setChalaniRecord(updatedData);
      setIsEditing(false);
      toast.success("चलानी रेकर्ड सफलतापूर्वक अपडेट भयो!");
    } catch (error) {
      console.error("Error updating chalani record:", error);
      toast.error("चलानी रेकर्ड अपडेट गर्न असफल भयो।");
    } finally {
      setUpdateLoading(false);
    }
  };

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
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={updateLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaEdit />
                  )}
                  {updateLoading ? "सुरक्षित गर्दै..." : "सुरक्षित गर्नुहोस्"}
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

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">
            चलानी रेकर्ड विवरण
          </h1>
          <p className="text-gray-600">
            चलानी नम्बर:{" "}
            <span className="font-semibold">
              {chalaniRecord.chalani_number}
            </span>
          </p>
        </div>
      </div>

      {/* Content Grid - Choose between view or edit mode */}
      {isEditing ? (
        <ChalaniEditForm
          chalaniRecord={chalaniRecord}
          editFormData={editFormData}
          handleInputChange={handleInputChange}
          handleDateInputChange={handleDateInputChange}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          updateLoading={updateLoading}
        />
      ) : (
        <ChalaniViewDetails chalaniRecord={chalaniRecord} />
      )}

      {/* Timestamp Information */}
      <div className="mt-6">
        <InfoCard title="समय जानकारी" icon={<FaCalendarAlt />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="सिर्जना मिति"
              value={
                chalaniRecord.created_at
                  ? new Date(chalaniRecord.created_at).toLocaleString("ne-NP")
                  : null
              }
              icon={<FaCalendarAlt />}
            />
            <InfoItem
              label="अन्तिम अपडेट"
              value={
                chalaniRecord.updated_at
                  ? new Date(chalaniRecord.updated_at).toLocaleString("ne-NP")
                  : null
              }
              icon={<FaCalendarAlt />}
            />
          </div>
        </InfoCard>
      </div>
    </div>
  );
};

export default ChalaniDetails;
