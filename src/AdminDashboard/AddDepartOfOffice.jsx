import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaBuilding, FaPlus, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const AddDepartOfOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const { officeId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", belongs_to: officeId });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [officeName, setOfficeName] = useState(""); 
  
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      belongs_to: officeId
    }));
    
    if (officeId) {
      fetchOfficeDetails();
      fetchDepartments();
    }
  }, [officeId]);

  const fetchOfficeDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/offices/${officeId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      if (response.data) {
        setOfficeName(response.data.name);
      }
    } catch (error) {
      console.error("Error fetching office details:", error);
      toast.error("कार्यालयको विवरण प्राप्त गर्न सकिएन।");
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/offices/${officeId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      
      if (response.data && response.data.departments) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("विभागहरू प्राप्त गर्न सकिएन।");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("कृपया विभागको नाम प्रविष्ट गर्नुहोस्");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(`${baseUrl}/department/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data) {
        toast.success("विभाग सफलतापूर्वक थपियो!");
        setFormData({ name: "", belongs_to: officeId });
        fetchDepartments(); // Refresh the departments list
      }
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error("विभाग थप्न असफल। कृपया फेरि प्रयास गर्नुहोस्।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix navigation to correctly go to the admin dashboard with the add-office tab
  const handleReturnToOffices = () => {
    // Set the admin tab to "add-office" in localStorage so the AdminDashboard component renders the correct content
    localStorage.setItem("adminTab", "add-office");
    // Navigate to AdminDashboard component
    navigate("/admindashboard");
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={handleReturnToOffices}
            className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors flex items-center gap-2"
          >
            <FaArrowLeft /> कार्यालय सूचीमा फिर्ता
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Form Section */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
              <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
                <h2 className="text-center font-bold text-xl text-[#E68332] flex items-center justify-center gap-2">
                  <FaBuilding className="text-[#E68332]" />
                  {officeName ? `${officeName} - विभाग थप्नुहोस्` : "नयाँ विभाग थप्नुहोस्"}
                </h2>
                <p className="text-center text-gray-600 mt-1">
                  कार्यालय संरचनामा नयाँ विभाग थप्नुहोस्
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-800 font-medium mb-2 flex items-center">
                    <FaBuilding className="mr-2 text-[#E68332]" />
                    विभागको नाम
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all"
                    placeholder="विभागको नाम यहाँ लेख्नुहोस्"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1 italic">
                    यो विभाग "{officeName}" कार्यालय अन्तर्गत थपिनेछ
                  </p>
                </div>

                <div className="flex justify-center mt-8">
                  <button 
                    type="submit" 
                    className={`px-6 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-[#E68332] hover:bg-[#c36f2a]'}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        प्रतिक्रिया पर्खँदै...
                      </>
                    ) : (
                      <>
                        <FaPlus />
                        विभाग थप्नुहोस्
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Departments List Section */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 border-l-4 border-[#E68332]">
                <h2 className="text-center font-bold text-xl text-[#E68332] flex items-center justify-center gap-2">
                  <FaBuilding className="text-[#E68332]" />
                  मौजुदा विभागहरू
                </h2>
                <p className="text-center text-gray-600 mt-1">
                  {officeName} कार्यालयका सबै विभागहरू
                </p>
              </div>
              
              <div className="p-6">
                {departments.length > 0 ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {departments.map((dept, index) => (
                      <div 
                        key={dept.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-gray-50 flex items-center"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                          animation: "fadeIn 0.5s ease-in-out"
                        }}
                      >
                        <FaBuilding className="text-[#E68332] mr-3 text-lg" />
                        <div>
                          <p className="font-medium">{dept.name}</p>
                          <p className="text-xs text-gray-500">ID: {dept.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    <FaBuilding className="mx-auto text-gray-300 text-4xl mb-3" />
                    <p>कुनै विभागहरू भेटिएन</p>
                    <p className="text-sm mt-2">यो कार्यालयमा अहिलेसम्म कुनै पनि विभाग थपिएको छैन।</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }
      `}</style>
    </>
  );
};

export default AddDepartOfOffice;