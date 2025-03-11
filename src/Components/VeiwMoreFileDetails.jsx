import {
  faBackspace,
  faBackward,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TippaniFormModal from "./TippaniFormModal";
import DocumentFormModal from "./DocumentFormModal";
import { IoMdArrowRoundBack } from "react-icons/io";

const ViewMoreFileDetails = () => {
  const { id } = useParams();
  console.log(id);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [fileDetails, setFileDetails] = useState(null);
  const [isTippaniModalOpen, setIsTippaniModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tipani, setTippani] = useState(false);
  const [letters, setLetter] = useState(false);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();
  const [newTippani, setNewTippani] = useState({
    subject: "",
    submitted_by: "",
    submitted_date: "",
    approved_by: "",
    approved_date: "",
    remarks: "",
    tippani_date: "",
    page_no: "",
  });
  const [newDoc, setNewDoc] = useState({
    registration_no: "",
    invoice_no: "",
    date: "",
    subject: "",
    letter_date: "",
    office: "",
    page_no: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFileDetails();
  }, []);

  const fetchFileDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      setFileDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching file details:", error);
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditable(!editable);
  };

  const handleChange = (e, field, index, type) => {
    const value = e.target.value;
    if (type === "tippani") {
      const updatedTippani = [...fileDetails.tippani];
      updatedTippani[index][field] = value;
      setFileDetails({ ...fileDetails, tippani: updatedTippani });
    } else if (type === "document") {
      const updatedDocs = [...fileDetails.letters_and_documents];
      updatedDocs[index][field] = value;
      setFileDetails({ ...fileDetails, letters_and_documents: updatedDocs });
    }
  };

  const addTippani = () => {
    setTippani(true);
    setFileDetails((prevState) => ({
      ...prevState,
      tippani: [...prevState.tippani, newTippani],
    }));
    setNewTippani({
      subject: "",
      submitted_by: "",
      submitted_date: "",
      approved_by: "",
      approved_date: "",
      remarks: "",
      tippani_date: "",
      page_no: "",
    });
  };

  const addDocument = () => {
    setLetter(true);
    setFileDetails((prevState) => ({
      ...prevState,
      letters_and_documents: [...prevState.letters_and_documents, newDoc],
    }));
    setNewDoc({
      registration_no: "",
      invoice_no: "",
      date: "",
      subject: "",
      letter_date: "",
      office: "",
      page_no: "",
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          tippani: fileDetails.tippani,
          letters_and_documents: fileDetails.letters_and_documents,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      await fetchFileDetails();
      
      setEditable(false);
      console.log(response);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating file:", error);
      alert(`Failed to save changes: ${error.message}`);
    } finally {
      
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-[#E68332] text-lg">
        Loading...
      </div>
    );
  }

  if (!fileDetails) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        File not found
      </div>
    );
  }

  // Extracting properties safely from nested objects
  const {
    file_name,
    subject,
    file,
    file_number,
    present_date,
    days_submitted,
    total_tippani_pages,
    total_documents_pages,
    total_page_count,
    letters_and_documents,
    tippani,
    province,
    district,
    municipality,
    ward_no,
    tole,
  } = fileDetails;

  // Safely extract nested object properties
  const related_guthi_name = fileDetails.related_guthi ? fileDetails.related_guthi.name : "N/A";
  const related_department_name = fileDetails.related_department ? fileDetails.related_department.name : "N/A";
  const submitted_by_name = fileDetails.submitted_by || "N/A";
  
  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    if (level === "5") {
      navigate("/admindashboard");
    } else {
      navigate("/employeeheader");
    // } else {
    //   navigate("/login");
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div
        onClick={() => {
          handleNavigate();
        }}
        className="justify-end px-4 py-1 items-end flex fixed top-2 left-2 text-white font-semibold bg-[#E68332] cursor-pointer gap-2 rounded-md"
      >
        <div className="text-lg flex items-center gap-2"><IoMdArrowRoundBack/> Home</div>
        {/* <FontAwesomeIcon className="text-xl" icon={faHome} /> */}
      </div>
      <h1 className="text-3xl font-bold text-[#E68332] mb-3 text-center">
        File Details
      </h1>

      {/* File Information */}
      <div className="w-[94%] md:w-[98%] mx-auto md:flex">
        <div className="mb-8 md:w-1/2 w-[98%] mx-auto">
          <h2 className="text-2xl font-semibold text-[#E68332] mb-4">
            File Information
          </h2>
          <div className="w-[94%] border border-[#E68332] rounded-md">
            <div className="w-full py-2 px-3 bg-[#E68332] text-xl font-semibold text-left text-white rounded-t-md">
              File Details
            </div>
            <div className="w-full p-1">
              {/* first section */}
              <div className="my-1 mx-auto w-[94%]">
                <p className="text-lg font-normal text-gray-800">
                  File Number: <span className="font-mono">{file_number}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  File Name: <span className="font-mono">{file_name}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Subject: <span className="font-mono">{subject}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  File Name: <span className="font-mono">{file_name}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Related Guthi: <span className="font-mono">{related_guthi_name}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Related Department: <span className="font-mono">{related_department_name}</span>
                </p>
              </div>
              {/* second section */}
              <div className="my-2 mx-auto w-[94%] ml-auto text-left flex flex-col felx-col-1 items-start md:items-end">
                <p className="text-lg font-normal">
                  Pradesh: <span className="font-mono">{province}</span>
                </p>
                <p className="text-lg font-normal">
                  District: <span className="font-mono">{district}</span>
                </p>
                <p className="text-lg font-normal">
                  Nagarpalika/Gaunpalika: <span className="font-mono">{municipality}</span>
                </p>
                <p className="text-lg font-normal">
                  Ward No: <span className="font-mono">{ward_no}</span>
                </p>
                <p className="text-lg font-normal">
                  Local Name: <span className="font-mono">{tole}</span>
                </p>
              </div>
              {/* third section */}
              <div className="my-1 mx-auto w-[94%]">
                <p className="text-lg font-normal text-gray-800">
                  Present Date: <span className="font-mono">{present_date}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Submitted By: <span className="font-mono">{submitted_by_name}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Days Submitted: <span className="font-mono">{days_submitted}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Total tippani pages: <span className="font-mono">{total_tippani_pages}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Total Document pages: <span className="font-mono">{total_documents_pages}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  Total page count: <span className="font-mono">{total_page_count || "N/A"}</span>
                </p>
                <p className="text-lg font-normal text-gray-800">
                  File: <span className="font-mono">{file || "N/A"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tippani Table */}
        <div className="md:w-1/2 w-[98%] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#E68332] mb-4">
              Tippani
            </h2>
            <div className="overflow-auto max-h-[400px] rounded-t-lg">
              <table className="min-w-full table-auto border-none bg-gray-100 rounded-sm overflow-hidden">
                <thead>
                  <tr className="bg-[#E68332] text-white border-t-2 border-b-2 border-white text-nowrap py-3">
                    <th className="py-2 px-4 text-left border-none">Subject</th>
                    <th className="py-2 px-4 text-left border-none">
                      Submitted By
                    </th>
                    <th className="py-2 px-4 text-left border-none">
                      Submitted Date
                    </th>
                    <th className="py-2 px-4 text-left border-none">
                      Submitted to
                    </th>
                    <th className="py-2 px-4 text-left border-none">
                      Approval Date
                    </th>
                    <th className="py-2 px-4 text-left border-none">Remarks</th>
                    <th className="py-2 px-4 text-left border-none">
                      Tippani Date
                    </th>
                    <th className="py-2 px-4 text-left border-none">pages</th>
                  </tr>
                </thead>
                <tbody>
                  {tippani.map((tip, index) => (
                    <tr
                      key={index}
                      className="border-gray-300 border-b-2 text-center"
                    >
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={tip.subject || ""}
                            onChange={(e) =>
                              handleChange(e, "subject", index, "tippani")
                            }
                          />
                        ) : (
                          tip.subject || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={tip.submitted_by || ""}
                            onChange={(e) =>
                              handleChange(e, "submitted_by", index, "tippani")
                            }
                          />
                        ) : (
                          tip.submitted_by || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="date"
                            value={tip.submitted_date || ""}
                            onChange={(e) =>
                              handleChange(
                                e,
                                "submitted_date",
                                index,
                                "tippani"
                              )
                            }
                          />
                        ) : (
                          tip.submitted_date || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={tip.approved_by || ""}
                            onChange={(e) =>
                              handleChange(e, "approved_by", index, "tippani")
                            }
                          />
                        ) : (
                          tip.approved_by || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="date"
                            value={tip.approved_date || ""}
                            onChange={(e) =>
                              handleChange(e, "approved_date", index, "tippani")
                            }
                          />
                        ) : (
                          tip.approved_date || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={tip.remarks || ""}
                            onChange={(e) =>
                              handleChange(e, "remarks", index, "tippani")
                            }
                          />
                        ) : (
                          tip.remarks || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="date"
                            value={tip.tippani_date || ""}
                            onChange={(e) =>
                              handleChange(e, "tippani_date", index, "tippani")
                            }
                          />
                        ) : (
                          tip.tippani_date || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="number"
                            value={tip.page_no || ""}
                            onChange={(e) =>
                              handleChange(e, "page_no", index, "tippani")
                            }
                          />
                        ) : (
                          tip.page_no || "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editable && (
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setIsTippaniModalOpen(true)}
              >
                Add Tippani
              </button>
            )}
          </div>

          {/* Letters and Documents Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#E68332] mb-4">
              Letters and Documents
            </h2>
            <div className="overflow-auto max-h-[400px] rounded-t-lg">
              <table className="min-w-full table-auto border-none bg-gray-100 overflow-hidden">
                <thead>
                  <tr className="bg-[#E68332] text-white border-b-2 border-gray-300 text-nowrap">
                    <th className="py-2 px-4 text-left border-none">
                      Registration No
                    </th>
                    <th className="py-2 px-4 text-left border-none">
                      Chalani No
                    </th>
                    <th className="py-2 px-4 text-left border-none">Date</th>
                    <th className="py-2 px-4 text-left border-none">Subject</th>
                    <th className="py-2 px-4 text-left border-none">
                      Letter Date
                    </th>
                    <th className="py-2 px-4 text-left border-none">Office</th>
                    <th className="py-2 px-4 text-left border-none">Page No</th>
                  </tr>
                </thead>
                <tbody>
                  {letters_and_documents.map((doc, index) => (
                    <tr
                      key={index}
                      className="border-b-2 border-gray-300 text-center"
                    >
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={doc.registration_no || ""}
                            onChange={(e) =>
                              handleChange(
                                e,
                                "registration_no",
                                index,
                                "document"
                              )
                            }
                          />
                        ) : (
                          doc.registration_no || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={doc.invoice_no || ""}
                            onChange={(e) =>
                              handleChange(e, "invoice_no", index, "document")
                            }
                          />
                        ) : (
                          doc.invoice_no || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="date"
                            value={doc.date || ""}
                            onChange={(e) =>
                              handleChange(e, "date", index, "document")
                            }
                          />
                        ) : (
                          doc.date || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={doc.subject || ""}
                            onChange={(e) =>
                              handleChange(e, "subject", index, "document")
                            }
                          />
                        ) : (
                          doc.subject || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="date"
                            value={doc.letter_date || ""}
                            onChange={(e) =>
                              handleChange(e, "letter_date", index, "document")
                            }
                          />
                        ) : (
                          doc.letter_date || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={doc.office || ""}
                            onChange={(e) =>
                              handleChange(e, "office", index, "document")
                            }
                          />
                        ) : (
                          doc.office || "N/A"
                        )}
                      </td>
                      <td className="py-2 px-4 border-none">
                        {editable ? (
                          <input
                            type="text"
                            value={doc.page_no || ""}
                            onChange={(e) =>
                              handleChange(e, "page_no", index, "document")
                            }
                          />
                        ) : (
                          doc.page_no || "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editable && (
              <button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => setIsDocumentModalOpen(true)}
              >
                Add Document
              </button>
            )}

            {/* edit button */}
            {editable && (
              <div className="mt-4 flex justify-center">
                <button
                  className="px-6 py-2 bg-[#E68332] text-white rounded"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            )}

            <div className="mt-4 text-center">
              <button
                className="px-6 py-2 bg-[#E68332] text-white rounded"
                onClick={handleEditToggle}
              >
                {editable ? "Cancel" : "Edit"}
              </button>
            </div>
          </div>

          <TippaniFormModal
            isOpen={isTippaniModalOpen}
            onClose={() => setIsTippaniModalOpen(false)}
            onSubmit={addTippani}
            fileId={id}
          />

          <DocumentFormModal
            isOpen={isDocumentModalOpen}
            onClose={() => setIsDocumentModalOpen(false)}
            onSubmit={addDocument}
            fileId={id}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewMoreFileDetails;