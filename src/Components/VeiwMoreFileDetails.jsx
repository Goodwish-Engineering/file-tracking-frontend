import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const VeiwMoreFileDetails = () => {
  const { id } = useParams(); // Get file ID from URL
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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
    file,
    file_number,
    present_by,
    present_date,
    page_no,
    total_page,
    approvals,
    letters_and_documents,
  } = fileDetails;

  const {
    first_name,
    last_name,
    username,
    email,
    employee_id,
    position,
    user_type,
  } = present_by;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        File Details
      </h1>

      {/* File Details Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          File Information
        </h2>
        <table className="min-w-full table-auto border-collapse bg-gray-100 rounded-lg overflow-hidden">
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
              <td className="py-2 px-4 border-b">
                {first_name} {last_name}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Present Date</td>
              <td className="py-2 px-4 border-b">{present_date}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Page No</td>
              <td className="py-2 px-4 border-b">
                {page_no} / {total_page}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">File</td>
              <td className="py-2 px-4 border-b">
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Letters and Documents Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          Letters and Documents
        </h2>
        <table className="min-w-full table-auto border-collapse bg-gray-100 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4 text-left">Attribute</th>
              <th className="py-2 px-4 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Registration No</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.registration_no || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Invoice No</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.invoice_no || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Date</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.date || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Subject</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.subject || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Letter Date</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.letter_date || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Office</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.office || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Page No</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.page_no || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Related File</td>
              <td className="py-2 px-4 border-b">
                {letters_and_documents.related_file || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approvals Section */}
      <div>
        <h2 className="text-2xl font-semibold text-orange-500 mb-4">
          Approvals
        </h2>
        {approvals.length > 0 ? (
          <div>
            {approvals.map((approval, index) => (
              <div key={index} className="mb-4">
                <p>
                  <strong>Status:</strong> {approval.status}
                </p>
                <p>
                  <strong>Submitted By:</strong>{" "}
                  {approval.submitted_by.first_name}{" "}
                  {approval.submitted_by.last_name}
                </p>
                <p>
                  <strong>Transferred To:</strong>{" "}
                  {approval.transferred_to.first_name}{" "}
                  {approval.transferred_to.last_name}
                </p>
                <p>
                  <strong>Remarks:</strong> {approval.remarks || "N/A"}
                </p>
                <p>
                  <strong>Approval date:</strong>{" "}
                  {approval.approved_date || "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No approvals available.</p>
        )}
      </div>
    </div>
  );
};

export default VeiwMoreFileDetails;
