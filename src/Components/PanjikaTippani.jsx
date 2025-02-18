import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PanjikaTippani = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileId = localStorage.getItem("fileId");

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const toggleEdit = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].isEditing = !updatedRows[index].isEditing;
    setRows(updatedRows);
  };

  const saveRow = async (index) => {
    const row = rows[index];
    const url = `${baseUrl}/tippani/`;
    const method = row.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          present_file: row.present_file,
          present_subject: row.present_subject,
          submitted_by: row.submitted_by,
          submitted_date: row.submitted_date,
          remarks: row.remarks,
          approved_by: row.approved_by,
          approve_date: row.approve_date,
          tippani_date: row.tippani_date,
          related_file: row.related_file,
          page_no: row.page_no,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedRow = await response.json();
      const updatedRows = [...rows];
      updatedRows[index] = { ...savedRow, isEditing: false };
      setRows(updatedRows);
      setShowButton(true);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const [showButton, setShowButton] = useState(true);
  const addRow = () => {
    setShowButton(false);
    const newRow = {
      present_subject: "",
      submitted_by: "",
      submitted_date: "",
      remarks: "",
      approved_by: "",
      approve_date: "",
      tippani_date: "",
      page_no: "",
      isEditing: true,
      related_file: fileId,
    };
    setRows([...rows, newRow]);
  };

  return (
    <div className="p-3 w-full overflow-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-center font-bold text-xl mb-6 text-gray-700">
        Panjika Details Tippani
      </h1>
      {isLoading ? (
        <div className="text-center text-xl text-blue-500">Loading...</div>
      ) : (
        <>
          <table className="table-auto border-collapse border w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Submitted By</th>
                <th className="px-4 py-2 text-left">Submitted Date</th>
                <th className="px-4 py-2 text-left">Remarks</th>
                <th className="px-4 py-2 text-left">Approved By</th>
                <th className="px-4 py-2 text-left">Approval Date</th>
                <th className="px-4 py-2 text-left">Tippani Date</th>
                <th className="px-4 py-2 text-left">Page No</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.isEditing ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.present_subject || ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "present_subject",
                              e.target.value
                            )
                          }
                          className="border rounded-md px-3 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={row.page_no || ""}
                          onChange={(e) =>
                            handleChange(index, "page_no", e.target.value)
                          }
                          className="border rounded-md px-3 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => saveRow(index)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => toggleEdit(index)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{row.present_subject}</td>
                      <td className="px-4 py-2">{row.page_no}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => toggleEdit(index)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {showButton && (
            <button
              onClick={addRow}
              className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Row
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PanjikaTippani;
