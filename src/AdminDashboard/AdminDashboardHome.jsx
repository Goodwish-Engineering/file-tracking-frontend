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
  FaInfoCircle
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
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  const [stats, setStats] = useState({
    employeeCount: 0,
    totalFiles: 0,
    pendingFiles: 0,
    transferredFiles: 0,
    officesCount: 0,
    departmentsCount: 0,
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
      try {
        // Make parallel API calls for better performance
        const [employeesPromise, filesPromise, officesPromise, transferredFilesPromise, deletedFilesPromise] = 
          await Promise.allSettled([
            fetch(`${baseUrl}/user/all/`, {
              headers: { Authorization: `token ${token}` }
            }),
            fetch(`${baseUrl}/file/`, {
              headers: { Authorization: `token ${token}` }
            }),
            fetch(`${baseUrl}/offices/`, {
              headers: { Authorization: `token ${token}` }
            }),
            // Modified: Using direct file API with filtering in the component
            fetch(`${baseUrl}/file/`, {
              headers: { Authorization: `token ${token}` }
            }),
            fetch(`${baseUrl}/file/deleted/`, {
              headers: { Authorization: `token ${token}` }
            })
          ]);

        // Process employees data
        let employeeCount = 0;
        let recentEmployees = [];
        
        if (employeesPromise.status === 'fulfilled' && employeesPromise.value.ok) {
          const employeesData = await employeesPromise.value.json();
          // Filter out superusers
          const filteredData = employeesData.filter((user) => !user.is_superuser);
          employeeCount = filteredData.length;
          
          // Get 5 most recent employees
          recentEmployees = [...filteredData]
            .sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined))
            .slice(0, 5);
        }

        // Process files data
        let totalFiles = 0;
        let pendingFiles = 0;
        let recentFiles = [];
        let filesByDepartment = [];
        let departmentCounts = {};
        let filesData = [];
        
        if (filesPromise.status === 'fulfilled' && filesPromise.value.ok) {
          filesData = await filesPromise.value.json();
          totalFiles = filesData.length;
          
          // Count pending files (files not transferred)
          pendingFiles = filesData.filter(file => 
            !(file.approvals && file.approvals.some(approval => approval.is_transferred))
          ).length;
          
          // Get 5 most recent files
          recentFiles = filesData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
            
          // Count files by department
          filesData.forEach(file => {
            if (file.department && file.department.name) {
              const deptName = file.department.name;
              departmentCounts[deptName] = (departmentCounts[deptName] || 0) + 1;
            }
          });
          
          // Convert to array for chart
          filesByDepartment = Object.entries(departmentCounts).map(([name, count]) => ({
            name,
            count
          }));
        }
        
        // Process offices data
        let officesCount = 0;
        let departmentsCount = 0;
        
        if (officesPromise.status === 'fulfilled' && officesPromise.value.ok) {
          const officesData = await officesPromise.value.json();
          officesCount = officesData.length;
          
          // Count all departments across all offices
          departmentsCount = officesData.reduce((total, office) => {
            return total + (office.departments ? office.departments.length : 0);
          }, 0);
        }
        
        // Process transferred files data - FIXED: Now using the same filesData to count transferred files
        let transferredFiles = 0;
        
        if (transferredFilesPromise.status === 'fulfilled' && transferredFilesPromise.value.ok) {
          // If we have already fetched files data, use it to count transferred files
          if (filesData.length > 0) {
            transferredFiles = filesData.filter(file => 
              file.approvals && file.approvals.some(approval => approval.is_transferred)
            ).length;
          } else {
            // Otherwise, fetch it from the transferred files endpoint
            const transferredFilesData = await transferredFilesPromise.value.json();
            transferredFiles = transferredFilesData.filter(file => 
              file.approvals && file.approvals.some(approval => approval.is_transferred)
            ).length;
          }
        }
        
        // Process deleted files data
        let deletedFiles = 0;
        
        if (deletedFilesPromise.status === 'fulfilled' && deletedFilesPromise.value.ok) {
          const deletedData = await deletedFilesPromise.value.json();
          deletedFiles = deletedData.length;
        }
        
        // Update stats with all collected data
        setStats({
          employeeCount,
          totalFiles,
          pendingFiles,
          transferredFiles,
          officesCount,
          departmentsCount,
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
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#ED772F] border-r-transparent"></div>
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

      {/* Stats Cards - Fixed navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="कर्मचारीहरू" 
          value={stats.employeeCount} 
          icon={<FaUsers />} 
          bgColor="bg-blue-50" 
          textColor="text-blue-600"
          tabName="empdetails" 
        />
        
        <StatCard 
          title="कुल फाइलहरू" 
          value={stats.totalFiles} 
          icon={<FaFileAlt />} 
          bgColor="bg-green-50" 
          textColor="text-green-600"
          tabName="filedetails"
        />
        
        <StatCard 
          title="स्थानान्तरण नगरिएका" 
          value={stats.pendingFiles} 
          icon={<FaExchangeAlt />} 
          bgColor="bg-amber-50" 
          textColor="text-amber-600"
          tabName="nontransfer3"
        />
        
        <StatCard 
          title="स्थानान्तरण गरिएका" 
          value={stats.transferredFiles} 
          icon={<FaExchangeAlt />} 
          bgColor="bg-indigo-50" 
          textColor="text-indigo-600"
          tabName="transfered"
        />
        
        <StatCard 
          title="कार्यालयहरू" 
          value={stats.officesCount} 
          icon={<FaBuilding />} 
          bgColor="bg-pink-50" 
          textColor="text-pink-600"
          tabName="add-office"
        />
        
        <StatCard 
          title="विभागहरू" 
          value={stats.departmentsCount} 
          icon={<FaLayerGroup />} 
          bgColor="bg-purple-50" 
          textColor="text-purple-600"
          tabName="add-office"
        />
        
        <StatCard 
          title="मेटिएका फाइलहरू" 
          value={stats.deletedFiles} 
          icon={<FaTrash />} 
          bgColor="bg-red-50" 
          textColor="text-red-600"
          tabName="deleted-files"
        />
        
        <StatCard 
          title="अन्य कार्यहरू" 
          value="" 
          icon={<FaSearch />} 
          bgColor="bg-gray-50" 
          textColor="text-gray-600"
          isAction={true}
          tabName="empdetails"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Files by Department Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FaChartBar className="text-[#E68332]" />
            विभाग अनुसार फाइल वितरण
          </h2>
          
          {stats.filesByDepartment.length > 0 ? (
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
            <Link to="/empdetails" className="text-sm text-[#E68332] hover:underline">
              सबै हेर्नुहोस्
            </Link>
          </div>
          
          {stats.recentEmployees.length > 0 ? (
            <div className="space-y-3">
              {stats.recentEmployees.map((employee, idx) => (
                <div key={employee.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
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
          <Link to="/filedetails" className="text-sm text-[#E68332] hover:underline">
            सबै हेर्नुहोस्
          </Link>
        </div>
        
        {stats.recentFiles.length > 0 ? (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.file_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.file_type}</td>
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
          प्रशासक ड्यासबोर्ड मार्फत, तपाईं सम्पूर्ण फाइल ट्र्याकिंग प्रणाली को व्यवस्थापन गर्न सक्नुहुन्छ।
          कर्मचारी, कार्यालय, विभाग र फाइलहरू थप्न, हटाउन र सम्पादन गर्न सक्नुहुन्छ。
        </p>
      </div>
    </div>
  );
};

// Helper component for stat cards - Fixed to update adminTab in localStorage
const StatCard = ({ title, value, icon, bgColor, textColor, tabName, isAction = false }) => {
  const navigate = useNavigate();
  
  const handleTabChange = () => {
    // Just update localStorage with the tab name - don't navigate
    // The parent AdminDashboard will listen for this change
    localStorage.setItem("adminTab", tabName);
    // Force a re-render of the parent component by dispatching a custom event
    window.dispatchEvent(new Event('adminTabChange'));
  };
  
  return (
    <div 
      className={`${bgColor} p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
      onClick={handleTabChange}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className={`${textColor} text-xl font-semibold mb-1`}>{title}</h3>
          {isAction ? (
            <p className="text-gray-600 text-sm">थप हेर्नुहोस्...</p>
          ) : (
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          )}
        </div>
        <div className={`${textColor} p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Helper function for date formatting
const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  try {
    return date.toLocaleDateString('ne-NP', options);
  } catch (error) {
    // Fallback to default locale if Nepali locale is not supported
    return date.toLocaleDateString(undefined, options);
  }
};

export default AdminDashboardHome;
