import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DisplayEditOffice = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [officeData, setOfficeData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/offices/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.data) {
        setOfficeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching Office data:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-blue-500 my-3">
        Currently Available Offices
      </h1>

      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full bg-white border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-[#3F84E5] py-2 text-white border-b-2 border-gray-300">
              {/* <th className="px-4 py-2 text-center">Office Id</th> */}
              <th className="px-3 py-2 border-none text-center text-nowrap">Office Name</th>
              <th className="px-3 py-2 border-none text-center text-nowrap">Related Departments</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(officeData) && officeData.length > 0 ? (
              officeData.map((data, index) => (
                <tr
                  key={data.id || index}
                  className="hover:bg-gray-50 transition border-gray-300 border-b"
                >
                  {/* <td className="px-4 py-2 text-center border-none">
                    {data.id}
                  </td> */}
                  <td className="px-4 py-3 text-center border-none">
                    {data.name}
                  </td>
                  <td className="px-2 py-3 text-center text-nowrap border-none">
                    {Array.isArray(data.departments) &&
                    data.departments.length > 0 ? (
                      <ul className="list-none">
                        {data.departments.map((dept, i) => (
                          <li key={i} className="list-none">{dept.name}, </li>
                        ))}
                      </ul>
                    ) : (
                      " "
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-300">
                <td
                  colSpan="3"
                  className="text-center border-none py-4 text-gray-500"
                >
                  No office data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisplayEditOffice;
