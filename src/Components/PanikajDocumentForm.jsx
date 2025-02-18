import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PanjikaDocumentsForm = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileId = localStorage.getItem("fileId");
  const token = localStorage.getItem("token");
  const apiBaseUrl = `${baseUrl}/letter-document/`;
  const [showButton, setShowButton] = useState(true);
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setShowButton(false);
    setRows((prevRows) => [
      ...prevRows,
      {
        id: null,
        registration_no: "",
        invoice_no: "",
        date: "",
        letter_date: "",
        subject: "",
        office: "",
        page_no: 0,
        tippani: "",
        related_file: fileId,
        isSaved: false,
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
      setShowButton(true);
      setRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index] = { ...savedRow, isSaved: true };
        return updatedRows;
      });
    } catch (error) {
      console.error("Error saving row:", error);
    }
  };

  const deleteRow = async (index, id) => {
    if (!id) {
      setRows((prevRows) => prevRows.filter((_, i) => i !== index));
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}${id}/`, { method: "DELETE" });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-orange-500 overflow-auto">
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
                <th className="px-4 py-2">Chalani No.</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Letter Date</th>
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
                      className="w-32 border rounded px-2 py-1"
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
                      type="date"
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
                  <td className="px-4 py-2 space-x-2 flex gap-1 items-center">
                    {!row.isSaved && (
                      <button
                        onClick={() => saveRow(index)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    )}
                    <button
                      onClick={() => deleteRow(index, row.id)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showButton && (
            <button
              onClick={addRow}
              className="mt-4 bg-orange-500 text-white w-full rounded-lg py-2  hover:bg-orange-600"
            >
              Add Row
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PanjikaDocumentsForm;
