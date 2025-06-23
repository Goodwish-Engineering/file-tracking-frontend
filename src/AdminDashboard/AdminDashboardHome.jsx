import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaFileAlt, 
  FaExchangeAlt, 
  FaTrash,
  FaBuilding,
  FaLayerGroup,
  FaChartBar,
  FaSearch,
  FaUserTie,
  FaInfoCircle,
  FaSpinner
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardHome = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    employeeCount: 0,
    totalFiles: 0,
    pendingFiles: 0,
    transferredFiles: 0,
    officesCount: 0,
    departmentsCount: 0,
    fileTypesCount: 0,
    deletedFiles: 0,
    recentFiles: [],
    recentEmployees: [],
    filesByDepartment: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch employees data
        let employeeCount = 0;
        let recentEmployees = [];
        try {
          const employeesResponse = await fetch(`${baseUrl}/user/all/`, {
            headers: { Authorization: `Token ${token}` }
          });
          
          if (employeesResponse.ok) {
            const employeesData = await employeesResponse.json();
            if (Array.isArray(employeesData)) {
              // Filter out superusers
              const filteredData = employeesData.filter(user => !user.is_superuser);
              employeeCount = filteredData.length;
              
              // Get 5 most recent employees
              recentEmployees = [...filteredData]
                .sort((a, b) => new Date(b.date_joined || 0) - new Date(a.date_joined || 0))
                .slice(0, 5);
            }
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
        }

        // Fetch files data
        let totalFiles = 0;
        let pendingFiles = 0;
        let transferredFiles = 0;
        let recentFiles = [];
        let filesByDepartment = [];
        let departmentCounts = {};
        
        try {
          const filesResponse = await fetch(`${baseUrl}/file/`, {
            headers: { Authorization: `Token ${token}` }
          });
          
          if (filesResponse.ok) {
            let filesData = await filesResponse.json();
            
            // Check if the response is paginated
            if (filesData && filesData.data && Array.isArray(filesData.data)) {
              filesData = filesData.data;
            } else if (!Array.isArray(filesData)) {
              filesData = [];
            }
            
            totalFiles = filesData.length;
            
            // Count pending and transferred files
            pendingFiles = filesData.filter(file => 
              !(file.approvals && Array.isArray(file.approvals) && 
                file.approvals.some(approval => approval.is_transferred))
            ).length;
            
            transferredFiles = filesData.filter(file => 
              file.approvals && Array.isArray(file.approvals) && 
              file.approvals.some(approval => approval.is_transferred)
            ).length;
            
            // Get recent files
            recentFiles = [...filesData]
              .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
              .slice(0, 5);
            
            // Count files by department
            filesData.forEach(file => {
              if (file.related_department && file.related_department.name) {
                const deptName = file.related_department.name;
                departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
              } else if (file.department && file.department.name) {
                const deptName = file.department.name;
                departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
              }
            });
            
            // Convert to array for chart
            filesByDepartment = Object.entries(departmentCounts)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count) // Sort by count in descending order
              .slice(0, 10); // Take only top 10 departments for better visualization
          }
        } catch (error) {
          console.error("Error fetching files:", error);
        }

        // Fetch offices data
        let officesCount = 0;
        let departmentsCount = 0;
        
        try {
          const officesResponse = await fetch(`${baseUrl}/offices/`, {
            headers: { Authorization: `Token ${token}` }
          });
          
          if (officesResponse.ok) {
            const officesData = await officesResponse.json();
            if (Array.isArray(officesData)) {
              officesCount = officesData.length;
              
              // Count departments
              departmentsCount = officesData.reduce((total, office) => {
                return total + (office.departments && Array.isArray(office.departments) ? office.departments.length : 0);
              }, 0);
            }
          }
        } catch (error) {
          console.error("Error fetching offices:", error);
        }

        // Fetch deleted files data
        let deletedFiles = 0;
        
        try {
          const deletedResponse = await fetch(`${baseUrl}/file/deleted/`, {
            headers: { Authorization: `Token ${token}` }
          });
          
          if (deletedResponse.ok) {
            const deletedData = await deletedResponse.json();
            if (Array.isArray(deletedData)) {
              deletedFiles = deletedData.length;
            }
          }
        } catch (error) {
          console.error("Error fetching deleted files:", error);
        }

        // Fetch file types data
        let fileTypesCount = 0;
        
        try {
          const fileTypesResponse = await fetch(`${baseUrl}/file-type/`, {
            headers: { Authorization: `Token ${token}` }
          });
          
          if (fileTypesResponse.ok) {
            const fileTypesData = await fileTypesResponse.json();
            if (Array.isArray(fileTypesData)) {
              fileTypesCount = fileTypesData.length;
            }
          }
        } catch (error) {
          console.error("Error fetching file types:", error);
        }
        
        // Update stats with all collected data
        setStats({
          employeeCount,
          totalFiles,
          pendingFiles,
          transferredFiles,
          officesCount,
          departmentsCount,
          fileTypesCount,
          deletedFiles,
          recentFiles,
          recentEmployees,
          filesByDepartment
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("डाशबोर्ड डाटा लोड गर्न समस्या भयो।");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [baseUrl, token]);

  // Prepare chart data
  const chartData = {
    labels: stats.filesByDepartment.map(item => item.name),
    datasets: [
      {
        label: 'फाइलहरूको संख्या',
        data: stats.filesByDepartment.map(item => item.count),
        backgroundColor: 'rgba(230, 131, 50, 0.6)',
        borderColor: 'rgba(230, 131, 50, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'विभाग अनुसार फाइल वितरण',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // Helper function for safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—'; // Invalid date
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    } catch (error) {
      return '—'; // Return a dash for any error
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-[#ED772F] mb-4 mx-auto" />
          <p className="text-gray-600">डाटा लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 bg-red-50 rounded-lg text-red-700">
        <FaInfoCircle className="text-4xl mb-4" />
        <p className="text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#ED772F] text-white rounded-lg hover:bg-[#c36f2a]"
        >
          पुन: प्रयास गर्नुहोस्
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-6 rounded-xl shadow-md mb-8 border-l-4 border-[#E68332]">
        <h1 className="text-2xl font-bold text-gray-800">प्रशासक डाशबोर्ड</h1>
        <p className="text-gray-600 mt-1">फाइल ट्र्याकिंग प्रणालीको समग्र स्थिति हेर्नुहोस्</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="कर्मचारीहरू" 
          value={stats.employeeCount} 
          icon={<FaUsers size={20} />} 
          bgColor="bg-blue-50" 
          textColor="text-blue-600"
          tabName="empdetails" 
        />
        
        <StatCard 
          title="कुल फाइलहरू" 
          value={stats.totalFiles} 
          icon={<FaFileAlt size={20} />} 
          bgColor="bg-green-50" 
          textColor="text-green-600"
          tabName="filedetails"
        />
        
        <StatCard 
          title="स्थानान्तरण नगरिएका" 
          value={stats.pendingFiles} 
          icon={<FaExchangeAlt size={20} />} 
          bgColor="bg-amber-50" 
          textColor="text-amber-600"
          tabName="nontransfer3"
        />
        
        <StatCard 
          title="स्थानान्तरण गरिएका" 
          value={stats.transferredFiles} 
          icon={<FaExchangeAlt size={20} />} 
          bgColor="bg-indigo-50" 
          textColor="text-indigo-600"
          tabName="transfered"
        />
        
        <StatCard 
          title="कार्यालयहरू" 
          value={stats.officesCount} 
          icon={<FaBuilding size={20} />} 
          bgColor="bg-pink-50" 
          textColor="text-pink-600"
          tabName="add-office"
        />
        
        <StatCard 
          title="विभागहरू" 
          value={stats.departmentsCount} 
          icon={<FaLayerGroup size={20} />} 
          bgColor="bg-purple-50" 
          textColor="text-purple-600"
          tabName="add-office"
        />
        
        <StatCard 
          title="फाइल प्रकारहरू" 
          value={stats.fileTypesCount} 
          icon={<FaFileAlt size={20} />} 
          bgColor="bg-cyan-50" 
          textColor="text-cyan-600"
          tabName="file-types"
        />
        
        <StatCard 
          title="मेटिएका फाइलहरू" 
          value={stats.deletedFiles} 
          icon={<FaTrash size={20} />} 
          bgColor="bg-red-50" 
          textColor="text-red-600"
          tabName="deleted-files"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Files by Department Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartBar className="text-[#E68332]" />
            विभाग अनुसार फाइल वितरण
          </h2>
          
          {stats.filesByDepartment && stats.filesByDepartment.length > 0 ? (
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              कुनै विभाग-वार डाटा उपलब्ध छैन
            </div>
          )}
        </div>
        
        {/* Recent Employees */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaUserTie className="text-[#E68332]" />
              हालै थपिएका कर्मचारीहरू
            </h2>
            <button
              onClick={() => {
                localStorage.setItem("adminTab", "empdetails");
                navigate("/admindashboard");
              }}
              className="text-sm text-[#E68332] hover:underline"
            >
              सबै हेर्नुहोस्
            </button>
          </div>
          
          {stats.recentEmployees && stats.recentEmployees.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEmployees.map((employee, idx) => (
                <div key={idx} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-[#E68332] bg-opacity-10 p-2 rounded-full mr-3">
                    <FaUserTie className="text-[#E68332]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {`${employee.first_name || ''} ${employee.last_name || ''}`}
                    </p>
                    <p className="text-sm text-gray-500">{employee.position || 'अनौपचारिक पद'}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(employee.date_joined)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              कुनै हालैका कर्मचारी डाटा उपलब्ध छैन
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Files */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FaFileAlt className="text-[#E68332]" />
            हालै थपिएका फाइलहरू
          </h2>
          <button
            onClick={() => {
              localStorage.setItem("adminTab", "filedetails");
              navigate("/admindashboard");
            }}
            className="text-sm text-[#E68332] hover:underline"
          >
            सबै हेर्नुहोस्
          </button>
        </div>
        
        {stats.recentFiles && stats.recentFiles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">फाइल नाम</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">प्रकार</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">मिति</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">स्थिति</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentFiles.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.file_name || 'Unnamed File'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {typeof file.file_type === 'object' ? file.file_type?.name : file.file_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(file.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        file.approvals && file.approvals.some(approval => approval.is_transferred)
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {file.approvals && file.approvals.some(approval => approval.is_transferred) 
                          ? 'स्वीकृत' 
                          : 'प्रक्रियामा'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            कुनै हालैका फाइल डाटा उपलब्ध छैन
          </div>
        )}
      </div>
      
      {/* System Information */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">प्रशासन जानकारी</h3>
        <p className="text-gray-600">
          प्रशासक ड्यासबोर्ड मार्फत, तपाईं सम्पूर्ण फाइल ट्र्याकिंग प्रणाली को व्यवस्थापन गर्न सक्नुहुन्छ。
          कर्मचारी, कार्यालय, विभाग र फाइलहरू थप्न, हटाउन र सम्पादन गर्न सक्नुहुन्छ。
        </p>
      </div>
    </div>
  );
};

// Helper component for stat cards
const StatCard = ({ title, value, icon, bgColor, textColor, tabName }) => {
  const navigate = useNavigate();
  
  const handleTabChange = () => {
    localStorage.setItem("adminTab", tabName);
    navigate("/admindashboard");
  };
  
  return (
    <div 
      className={`${bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
      onClick={handleTabChange}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`${textColor} text-xl font-semibold mb-1`}>{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${textColor} p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
