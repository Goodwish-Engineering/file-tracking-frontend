import React, { useEffect, useState } from "react";

const PanjikaForm = ({ baseUrl }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/tippani/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const dataWithEditing = data.map((row) => ({ ...row, isEditing: false }));
      setRows(dataWithEditing || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    const url = `${baseUrl}/tippani/${row.id || ""}/`;
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
          present_by: row.present_by,
          present_date: row.present_date,
          page_no: row.page_no,
          total_page: row.total_page,
          approved_by: row.approved_by,
          approve_date: row.approve_date,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedRow = await response.json();
      const updatedRows = [...rows];
      updatedRows[index] = { ...savedRow, isEditing: false };
      setRows(updatedRows);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const addRow = () => {
    const newRow = {
      id: `temp-${Date.now()}`, // Temporary ID
      present_file: "",
      present_subject: "",
      present_by: "",
      present_date: "",
      page_no: 0,
      total_page: 0,
      approved_by: "",
      approve_date: "",
      isEditing: true,
    };
    setRows([...rows, newRow]);
  };

  const removeRow = async (id) => {
    if (id.startsWith("temp")) {
      setRows(rows.filter((row) => row.id !== id)); // Remove unsaved rows locally
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/tippani/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error removing row:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center font-bold text-lg mb-4">
        PANJIKA DETAILS TIPPANI
      </h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-4 py-2">File</th>
                <th className="border border-gray-400 px-4 py-2">Subject</th>
                <th className="border border-gray-400 px-4 py-2">
                  Presented By
                </th>
                <th className="border border-gray-400 px-4 py-2">
                  Presented Date
                </th>
                <th className="border border-gray-400 px-4 py-2">Page No</th>
                <th className="border border-gray-400 px-4 py-2">
                  Total Pages
                </th>
                <th className="border border-gray-400 px-4 py-2">
                  Approved By
                </th>
                <th className="border border-gray-400 px-4 py-2">
                  Approval Date
                </th>
                <th className="border border-gray-400 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="text-center">
                  {row.isEditing ? (
                    <>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="text"
                          value={row.present_file || ""}
                          onChange={(e) =>
                            handleChange(index, "present_file", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
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
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="text"
                          value={row.present_by || ""}
                          onChange={(e) =>
                            handleChange(index, "present_by", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="date"
                          value={row.present_date || ""}
                          onChange={(e) =>
                            handleChange(index, "present_date", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="number"
                          value={row.page_no || ""}
                          onChange={(e) =>
                            handleChange(index, "page_no", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="number"
                          value={row.total_page || ""}
                          onChange={(e) =>
                            handleChange(index, "total_page", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="text"
                          value={row.approved_by || ""}
                          onChange={(e) =>
                            handleChange(index, "approved_by", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <input
                          type="date"
                          value={row.approve_date || ""}
                          onChange={(e) =>
                            handleChange(index, "approve_date", e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <button
                          onClick={() => saveRow(index)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => toggleEdit(index)}
                          className="ml-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.present_file}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.present_subject}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.present_by}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.present_date}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.page_no}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.total_page}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.approved_by}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {row.approve_date}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <button
                          onClick={() => toggleEdit(index)}
                          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeRow(row.id)}
                          className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRow}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Row
          </button>
        </>
      )}
    </div>
  );
};

export default PanjikaForm;
