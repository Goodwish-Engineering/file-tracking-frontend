import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaPlus,
  FaFileAlt,
  FaCheck,
  FaSpinner,
  FaTrash,
  FaEdit,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

const FileTypeManagement = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [fileTypes, setFileTypes] = useState([]);
  const [newFileType, setNewFileType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchFileTypes();
  }, []);

  const fetchFileTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/file-type/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file types");
      }

      const data = await response.json();
      setFileTypes(data);
    } catch (error) {
      console.error("Error fetching file types:", error);
      toast.error("फाइल प्रकारहरू प्राप्त गर्न असफल भयो।");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFileType = async (e) => {
    e.preventDefault();
    
    if (!newFileType.trim()) {
      toast.error("कृपया फाइल प्रकारको नाम प्रविष्ट गर्नुहोस्");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/file-type/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ name: newFileType.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add file type");
      }

      const newType = await response.json();
      setFileTypes([...fileTypes, newType]);
      setNewFileType("");
      toast.success("फाइल प्रकार सफलतापूर्वक थपियो!");
    } catch (error) {
      console.error("Error adding file type:", error);
      toast.error("फाइल प्रकार थप्न असफल भयो।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (fileType) => {
    setEditingId(fileType.id);
    setEditingName(fileType.name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim()) {
      toast.error("फाइल प्रकारको नाम खाली हुन सक्दैन");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/file-type/${editingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ name: editingName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update file type");
      }

      const updatedType = await response.json();
      setFileTypes(fileTypes.map(type => 
        type.id === editingId ? updatedType : type
      ));
      setEditingId(null);
      setEditingName("");
      toast.success("फाइल प्रकार सफलतापूर्वक अपडेट गरियो!");
    } catch (error) {
      console.error("Error updating file type:", error);
      toast.error("फाइल प्रकार अपडेट गर्न असफल भयो।");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("के तपाईं साँच्चै यो फाइल प्रकार मेटाउन चाहनुहुन्छ?")) {
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/file-type/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file type");
      }

      setFileTypes(fileTypes.filter(type => type.id !== id));
      toast.success("फाइल प्रकार सफलतापूर्वक मेटाइयो!");
    } catch (error) {
      console.error("Error deleting file type:", error);
      toast.error("फाइल प्रकार मेटाउन असफल भयो।");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#E68332] border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-6 rounded-xl shadow-md mb-8 border-l-4 border-[#E68332]">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <FaFileAlt className="text-[#E68332]" />
          फाइल प्रकार व्यवस्थापन
        </h1>
        <p className="text-gray-600 mt-1">
          फाइल प्रकारहरू थप्नुहोस्, सम्पादन गर्नुहोस्, र व्यवस्थापन गर्नुहोस्
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New File Type Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
            <h2 className="text-xl font-bold text-[#E68332] flex items-center gap-2">
              <FaPlus className="text-[#E68332]" />
              नयाँ फाइल प्रकार थप्नुहोस्
            </h2>
          </div>

          <form onSubmit={handleAddFileType} className="p-6">
            <div className="mb-6">
              <label className="text-gray-800 font-medium mb-2 flex items-center">
                <FaFileAlt className="mr-2 text-[#E68332]" />
                फाइल प्रकारको नाम
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                placeholder="उदाहरण: निवेदन पत्र, प्रतिवेदन, आदेश"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-[#E68332] hover:bg-[#c36f2a]"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    थप्दै...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    थप्नुहोस्
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* File Types List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
            <h2 className="text-xl font-bold text-[#E68332] flex items-center gap-2">
              <FaFileAlt className="text-[#E68332]" />
              मौजुदा फाइल प्रकारहरू ({fileTypes.length})
            </h2>
          </div>

          <div className="p-6">
            {fileTypes.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {fileTypes.map((fileType, index) => (
                  <div
                    key={fileType.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-gray-50"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                      animation: "fadeIn 0.5s ease-in-out"
                    }}
                  >
                    <div className="flex items-center flex-1">
                      <FaFileAlt className="text-[#E68332] mr-3 text-lg" />
                      {editingId === fileType.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p className="font-medium text-gray-800">{fileType.name}</p>
                          <p className="text-xs text-gray-500">ID: {fileType.id}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editingId === fileType.id ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-all duration-200"
                            title="सुरक्षित गर्नुहोस्"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                            title="रद्द गर्नुहोस्"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(fileType)}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-all duration-200"
                            title="सम्पादन गर्नुहोस्"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(fileType.id)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-all duration-200"
                            title="मेटाउनुहोस्"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FaFileAlt className="mx-auto text-gray-300 text-6xl mb-4" />
                <p className="text-lg font-medium">कुनै फाइल प्रकारहरू फेला परेन</p>
                <p className="text-sm mt-2">
                  शुरुवात गर्नको लागि पहिले फाइल प्रकार थप्नुहोस्।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          फाइल प्रकार व्यवस्थापन बारे जानकारी
        </h3>
        <div className="text-blue-700 space-y-2">
          <p>• फाइल प्रकारहरूले फाइलहरूलाई श्रेणीबद्ध गर्न मद्दत गर्छ</p>
          <p>• प्रत्येक फाइल अपलोड गर्दा एक प्रकार चयन गर्नुपर्छ</p>
          <p>• फाइल प्रकारहरू मेटाउनु अघि सुनिश्चित गर्नुहोस् कि ती प्रयोगमा छैनन्</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default FileTypeManagement;
