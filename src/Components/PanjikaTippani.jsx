import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PanjikaTippani = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileId = localStorage.getItem("fileId");
  const [showButton, setShowButton] = useState(true);

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
    const method = row.id ? "Patch" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const savedRow = await response.json();
      const updatedRows = [...rows];
      updatedRows[index] = { ...savedRow, isEditing: false };
      setRows(updatedRows);
      setShowButton(true);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const addRow = () => {
    setShowButton(false);
    setRows([
      ...rows,
      {
        subject: "",
        submitted_by: "",
        submitted_date: "",
        remarks: "",
        approved_by: "",
        approved_date: "",
        tippani_date: "",
        page_no: "",
        isEditing: true,
        related_file: fileId,
      },
    ]);
  };

  const deleteRow = async (index) => {
    const row = rows[index];
    const url = `${baseUrl}/tippani/${row.id}`;

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <div className="p-4 w-full overflow-auto bg-orange-100 shadow-lg rounded-lg">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-700">
        Panjika Details Tippani
      </h1>
      {isLoading ? (
        <div className="text-center text-xl text-orange-500">Loading...</div>
      ) : (
        <>
          <table className="table-auto border-collapse border w-full text-sm shadow-md rounded-lg overflow-hidden">
            <thead className="bg-orange-500 text-white">
              <tr>
                {[
                  "Subject",
                  "Submitted By",
                  "Submitted Date",
                  "Remarks",
                  "Submitted to",
                  "Approval Date",
                  "Tippani Date",
                  "Page No",
                  "Actions",
                ].map((head) => (
                  <th key={head} className="px-4 py-2 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-orange-50 border-b">
                  {row.isEditing
                    ? [
                        "subject",
                        "submitted_by",
                        "submitted_date",
                        "remarks",
                        "approved_by",
                        "approved_date",
                        "tippani_date",
                        "page_no",
                      ].map((field) => (
                        <td key={field} className="px-4 py-2">
                          <input
                            type={field.includes("date") ? "date" : "text"}
                            value={row[field] || ""}
                            onChange={(e) =>
                              handleChange(index, field, e.target.value)
                            }
                            className="border rounded-md px-3 py-1 w-32"
                          />
                        </td>
                      ))
                    : [
                        "subject",
                        "submitted_by",
                        "submitted_date",
                        "remarks",
                        "approved_by",
                        "approved_date",
                        "tippani_date",
                        "page_no",
                      ].map((field) => (
                        <td key={field} className="px-4 py-2">
                          {row[field]}
                        </td>
                      ))}
                  <td className="px-4 py-2 flex space-x-2">
                    {row.isEditing ? (
                      <>
                        <button
                          onClick={() => saveRow(index)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => toggleEdit(index)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => deleteRow(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showButton && (
            <button
              onClick={addRow}
              className="mt-6 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
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
