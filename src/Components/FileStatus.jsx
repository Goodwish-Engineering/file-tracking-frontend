import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FileStatus = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/file/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      const data = await response.json();
      const filteredData = data.filter(file => file.is_disabled === false);
      setFileStatuses(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filteredFiles = fileStatuses.filter((file) =>
    searchQuery
      .toLowerCase()
      .split(" ")
      .every((query) =>
        [
          file.file_name.toLowerCase(),
          file.subject.toLowerCase(),
          String(file.id),
          String(file.file_number),
        ].some((field) => field.includes(query))
      )
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="आईडी, फाइल नम्बर, नाम, वा विषयद्वारा खोज्नुहोस्..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg focus:border-blue-600 w-1/3"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full mx-auto shadow-md rounded-lg border-none border-separate border-spacing-y-4">
          <thead className="text-gray-800">
            <tr className="border border-white border-t-2 border-b-2">
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                आईडी
              </th>
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                फाइल नं
              </th>
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                फाइलको नाम 
              </th>
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                विषय 
              </th>
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                फाइल आएको समय
              </th>
              <th className="p-3 text-center border-none text-nowrap font-normal text-md text-gray-700">
                कार्य 
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, index) => (
                <tr
                  key={file.id}
                  className="text-black text-center my-4 gap-5 shadow-gray-100 text-nowrap border-none shadow-[4px_4px_5px_rgba(0,0,0,0.2)] rounded-lg"
                >
                  <td className="py-4 px-4 border-none bg-gray-50 rounded-l-xl">{file.id}</td>
                  <td className="py-4 px-4 border-none bg-gray-50">{file.file_number}</td>
                  <td className="py-4 px-4 border-none bg-gray-50">{file.file_name}</td>
                  <td className="py-4 px-4 border-none bg-gray-50">{file.subject}</td>
                  <td className="py-4 px-4 border-none bg-gray-50">{file.days_submitted}</td>
                  <td className="py-4 px-4 border-none bg-gray-50 flex justify-center items-center gap-4 rounded-r-xl">
                    <button
                      onClick={() => navigate(`/file-details/${file.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-all"
                    >
                      थप हेर्नुहोस्
                    </button>
                    <button
                      onClick={()=> navigate(`/file-history/${file.id}`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-all"
                      >
                      इतिहास हेर्नुहोस्
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-none border-t-0 border-b-2 border-white">
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-600 border-none border-b-2"
                >
                  कुनै फाइलहरू उपलब्ध छैनन्。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileStatus;
