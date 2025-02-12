import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PanjikaDocumentsForm = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileId = localStorage.getItem("fileId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const apiBaseUrl = `${baseUrl}/letter-document/`;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiBaseUrl);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRows(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: null,
        registration_no: "",
        invoice_no: "",
        date: "",
        letter_date: "", // Added letter_date field
        subject: "",
        office: "",
        page_no: 0,
        tippani: "",
        related_file: fileId,
      },
    ]);
  };

  const saveRow = async (index) => {
    const row = rows[index];
    const method = row.id ? "PUT" : "POST";
    const url = row.id ? `${apiBaseUrl}${row.id}/` : apiBaseUrl;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: token ? `token ${token.trim()}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(row),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const savedRow = await response.json();
      const updatedRows = [...rows];
      updatedRows[index] = savedRow;
      setRows(updatedRows);
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const deleteRow = async (id) => {
    if (!id) {
      setRows(rows.filter((row) => row.id !== id));
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}${id}/`, { method: "DELETE" });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-orange-500">
      <h1 className="text-center text-xl font-bold text-orange-600 mb-6">
        PANJIKA DOCUMENTS
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-700 font-semibold">
          Loading...
        </div>
      ) : (
        <>
          <table className="w-full text-sm bg-white shadow-sm rounded-lg overflow-hidden border border-gray-300">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Darta No.</th>
                <th className="px-4 py-2">Office</th>
                <th className="px-4 py-2">Invoice No.</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Letter Date</th>{" "}
                {/* New Column for Letter Date */}
                <th className="px-4 py-2">Total Pages</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || index} className="text-center border-b">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) =>
                        handleInputChange(index, "subject", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.registration_no}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "registration_no",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.office}
                      onChange={(e) =>
                        handleInputChange(index, "office", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={row.invoice_no}
                      onChange={(e) =>
                        handleInputChange(index, "invoice_no", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleInputChange(index, "date", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="date" // letter_date should be a date input field
                      value={row.letter_date}
                      onChange={(e) =>
                        handleInputChange(index, "letter_date", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={row.page_no}
                      onChange={(e) =>
                        handleInputChange(index, "page_no", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => saveRow(index)}
                      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteRow(row.id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={addRow}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Add Row
          </button>
        </>
      )}
    </div>
  );
};

export default PanjikaDocumentsForm;
