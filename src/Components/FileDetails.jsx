import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const FileDetails = ({ setShowButton, clearData }) => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const empId = localStorage.getItem("empId");
  const [show, setshow] = useState(true);
  const [formData, setFormData] = useState({
    file_name: "",
    subject: "",

    province: "",
    district: "",
    municipality: "",
    ward_no: "",
    tole: "",
    present_by: empId,
    submited_by: "",
    present_date: "",
  });
  const clearFeilds = () => {
    setFormData({
      file_name: "",
      subject: "",

      province: "",
      district: "",
      municipality: "",
      ward_no: "",
      tole: "",
      present_by: empId,
      submitted_by: "",
      present_date: "",
    });
  };
  useEffect(() => {
    clearFeilds();
    setshow(true);
  }, [clearData]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${baseUrl}/provinces/`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, [baseUrl]);

  const fetchDistricts = async (province) => {
    if (!province) return;
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchMunicipalities = async (district) => {
    if (!district || !formData.province) return;
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${formData.province}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "file" ? files[0] : value,
    }));

    if (name === "province") {
      setDistricts([]);
      setMunicipalities([]);
      fetchDistricts(value);
    }
    if (name === "district") {
      setMunicipalities([]);
      fetchMunicipalities(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    try {
      const response = await fetch(`${baseUrl}/files/upload/`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("File details submitted successfully!");
        localStorage.setItem("fileId", data.id);
        setShowButton(true);
        setshow(false);
      } else {
        alert("Failed to submit file details.");
      }
    } catch (error) {
      console.error("Error submitting file details:", error);
    }
  };

  return (
    <>
      <div className="w-full mx-auto p-6 bg-orange-50 border border-orange-300 rounded-lg mt-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold mb-6 text-orange-700">
          फारामको विवरण
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {Object.keys(formData).map(
            (key) =>
              key !== "present_by" && (
                <div key={key}>
                  <label className="block font-medium text-orange-800 capitalize">
                    {key.replace("_", " ")}
                  </label>
                  {key === "province" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-orange-400 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                    >
                      <option value="">प्रदेश छान्नुहोस्</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  ) : key === "district" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-orange-400 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                    >
                      <option value="">जिल्ला छान्नुहोस्</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  ) : key === "municipality" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-orange-400 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                    >
                      <option value="">नगरपालिका छान्नुहोस्</option>
                      {municipalities.map((municipality) => (
                        <option key={municipality} value={municipality}>
                          {municipality}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        key.includes("date")
                          ? "date"
                          : key === "file"
                          ? "file"
                          : "text"
                      }
                      name={key}
                      value={key === "file" ? undefined : formData[key]}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-orange-400 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2"
                    />
                  )}
                </div>
              )
          )}
          <div className="col-span-2 flex justify-center">
            {show && (
              <button
                type="submit"
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
              >
                रेकर्ड थप्नुहोस्
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default FileDetails;
