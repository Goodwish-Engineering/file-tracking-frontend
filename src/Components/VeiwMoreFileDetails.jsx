import {
  faBackspace,
  faBackward,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const VeiwMoreFileDetails = () => {
  const { id } = useParams();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();
  const [newTippani, setNewTippani] = useState({
    submitted_by: "",
    submitted_date: "",
    approved_by: "",
    approved_date: "",
    remarks: "",
    tippani_date: "",
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
    setFileDetails((prevState) => ({
      ...prevState,
      tippani: [...prevState.tippani, newTippani],
    }));
    setNewTippani({
      submitted_by: "",
      submitted_date: "",
      approved_by: "",
      approved_date: "",
      remarks: "",
      tippani_date: "",
    });
  };

  const addDocument = () => {
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
      await fetch(`${baseUrl}/file/${id}/`, {
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
      setEditable(false);
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-orange-600 text-lg">
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

  const {
    file_name,
    subject,
    related_office,
    file,
    file_number,
    present_by,
    present_date,
    days_submitted,
    total_tippani_pages,
    total_documents_pages,
    total_page_count,
    letters_and_documents,
    tippani,
  } = fileDetails;
  const level = localStorage.getItem("level");
  const handleNavigate = () => {
    if (level === "5") {
      navigate("/admindashboard");
    } else if (level === "1") {
      navigate("/employee1");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <div
        onClick={() => {
          handleNavigate();
        }}
        className="w-full justify-center items-center flex fixed top-0 text-white font-semibold bg-red-600 cursor-pointer gap-2 py-2 "
      >
        <h1>Home</h1>
        <FontAwesomeIcon icon={faHome} />
      </div>
      <h1 className="text-3xl font-bold text-orange-600 mb-6 mt-9 text-center">
        File Details
      </h1>

      {/* File Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          File Information
        </h2>
        <table className="min-w-full table-auto border-collapse bg-gray-100 rounded-lg overflow-auto">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 text-left">Attribute</th>
              <th className="py-2 px-4 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">File Name</td>
              <td className="py-2 px-4 border-b">{file_name}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Subject</td>
              <td className="py-2 px-4 border-b">{subject}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">File Number</td>
              <td className="py-2 px-4 border-b">{file_number}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Present By</td>
              <td className="py-2 px-4 border-b  ">
                {present_by.first_name}_{present_by.last_name}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Present Date</td>
              <td className="py-2 px-4 border-b">{present_date}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Days Submitted</td>
              <td className="py-2 px-4 border-b">{days_submitted}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Tippani Pages</td>
              <td className="py-2 px-4 border-b">{total_tippani_pages}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Documents Pages</td>
              <td className="py-2 px-4 border-b">{total_documents_pages}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Total Page Count</td>
              <td className="py-2 px-4 border-b">{total_page_count}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Related Office</td>
              <td className="py-2 px-4 border-b">{related_office || "N/A"}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">File</td>
              <td className="py-2 px-4 border-b">{file || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tippani Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">Tippani</h2>
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full table-auto border-collapse bg-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="py-2 px-4 text-left">Submitted By</th>
                <th className="py-2 px-4 text-left">Submitted Date</th>
                <th className="py-2 px-4 text-left">Approved By</th>
                <th className="py-2 px-4 text-left">Approval Date</th>
                <th className="py-2 px-4 text-left">Remarks</th>
                <th className="py-2 px-4 text-left">Tippani Date</th>
              </tr>
            </thead>
            <tbody>
              {tippani.map((tip, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
                    {editable ? (
                      <input
                        type="date"
                        value={tip.submitted_date || ""}
                        onChange={(e) =>
                          handleChange(e, "submitted_date", index, "tippani")
                        }
                      />
                    ) : (
                      tip.submitted_date || "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editable && (
          <button
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
            onClick={addTippani}
          >
            Add Tippani
          </button>
        )}
      </div>

      {/* Letters and Documents Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          Letters and Documents
        </h2>
        <div className="overflow-auto max-h-[400px]">
          <table className="min-w-full table-auto border-collapse bg-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="py-2 px-4 text-left">Registration No</th>
                <th className="py-2 px-4 text-left">Invoice No</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Subject</th>
                <th className="py-2 px-4 text-left">Letter Date</th>
                <th className="py-2 px-4 text-left">Office</th>
                <th className="py-2 px-4 text-left">Page No</th>
              </tr>
            </thead>
            <tbody>
              {letters_and_documents.map((doc, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">
                    {editable ? (
                      <input
                        type="text"
                        value={doc.registration_no || ""}
                        onChange={(e) =>
                          handleChange(e, "registration_no", index, "document")
                        }
                      />
                    ) : (
                      doc.registration_no || "N/A"
                    )}
                  </td>
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
                  <td className="py-2 px-4">
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
            onClick={addDocument}
          >
            Add Document
          </button>
        )}
      </div>

      {editable && (
        <div className="mt-4 flex justify-center">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          className="px-6 py-2 bg-yellow-500 text-white rounded"
          onClick={handleEditToggle}
        >
          {editable ? "Cancel" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default VeiwMoreFileDetails;
