import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaFile, 
  FaFileUpload, 
  FaFileAlt, 
  FaChartLine, 
  FaExchangeAlt, 
  FaSearch,
  FaInfoCircle,
  FaBell,
  FaRegClock,
  FaChartBar
} from "react-icons/fa";
import { RiFileTransferFill } from "react-icons/ri";
import { MdPending } from "react-icons/md";
import { formatNepaliDate, toNepaliDigits } from "../utils/dateConverter";
import { Bar } from "react-chartjs-2";
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

const EmployeeHome = () => {
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const level = localStorage.getItem("level");
  const [stats, setStats] = useState({
    totalFiles: 0,
    pendingFiles: 0,
    transferredFiles: 0,
    recentUploads: [],
    departmentFiles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [currentNepaliDate, setCurrentNepaliDate] = useState('');
  const [showChart, setShowChart] = useState(false); // Add this state for toggling between table and chart

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // We'll make two API calls in parallel for better performance
        const [fileStatsPromise, notificationsPromise] = await Promise.allSettled([
          // 1. Get file statistics - adapting from FileStatus.jsx pattern
          fetch(`${baseUrl}/file/`, {
            headers: { Authorization: `token ${token}` }
          }),
          
          // 2. Get notifications - adapting from Notification.jsx pattern
          fetch(`${baseUrl}/notification/`, {
            headers: { Authorization: `token ${token}` }
          })
        ]);
        
        // Process file statistics
        let totalFiles = 0;
        let pendingFiles = 0;
        let transferredFiles = 0; // Initialize transferred files count
        let recentUploads = [];
        let departmentFiles = [];
        let departments = {};
        
        if (fileStatsPromise.status === 'fulfilled' && fileStatsPromise.value.ok) {
          const filesData = await fileStatsPromise.value.json();
          totalFiles = filesData.length;
          
          // Calculate transferred files using the same logic as TransferredFiles.jsx
          const transferredFilesData = filesData.filter(
            (file) =>
              file.approvals && file.approvals.some((approval) => approval.is_transferred)
          );
          transferredFiles = transferredFilesData.length;
          
          // Calculate pending files (files not transferred)
          pendingFiles = filesData.filter(file => 
            !(file.approvals && file.approvals.some(approval => approval.is_transferred))
          ).length;
          
          // Process department-wise file distribution
          filesData.forEach(file => {
            if (file.department && file.department.name) {
              const deptName = file.department.name;
              departments[deptName] = (departments[deptName] || 0) + 1;
            }
          });
          
          // Convert to array for chart
          departmentFiles = Object.keys(departments).map(dept => ({
            department: dept,
            count: departments[dept]
          }));
          
          // Get 5 most recent uploads
          recentUploads = filesData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(file => ({
              file_name: file.file_name,
              file_type: file.file_type,
              created_at: file.created_at,
              status: file.approvals && file.approvals.some(approval => approval.is_transferred) 
                ? 'transferred' 
                : 'pending'
            }));
        }
        
        // Process notifications
        let notifications = [];
        if (notificationsPromise.status === 'fulfilled' && notificationsPromise.value.ok) {
          const notificationsData = await notificationsPromise.value.json();
          notifications = notificationsData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
        }
        
        // Update state with all collected data
        setStats({
          totalFiles,
          pendingFiles,
          transferredFiles,
          recentUploads,
          departmentFiles
        });
        
        setRecentNotifications(notifications);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("डाशबोर्ड डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set current Nepali date
    const today = new Date();
    setCurrentNepaliDate(formatNepaliDate(today));
  }, [baseUrl, token]);

  const handleAction = (action) => {
    // Store the selected tab in localStorage so EmployeeHeader can pick it up
    if (action === "upload" && level === "1") {
      localStorage.setItem("activeTab", "uploadTippani");
    } else if (action === "status") {
      localStorage.setItem("activeTab", "veiwStatus");
    } else if (action === "nontransfer") {
      if (level === "2") {
        localStorage.setItem("activeTab", "nontransfer");
      } else if (level === "3" || level === "4") {
        localStorage.setItem("activeTab", "nontransfer3");
      }
    } else if (action === "transferred") {
      localStorage.setItem("activeTab", "transfered");
    } else if (action === "request") {
      localStorage.setItem("activeTab", "filerequest");
    } else if (action === "notification") {
      localStorage.setItem("activeTab", "notification");
    }
    
    // Force a refresh of the current page which will trigger EmployeeHeader 
    // to read the new activeTab from localStorage
    window.location.reload();
  };

  // Reusable card component
  const StatCard = ({ title, value, icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${color} transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{toNepaliDigits(value)}</h3>
        </div>
        <div className={icon.props.className}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Action button component
  const ActionButton = ({ label, icon, onClick, color = "indigo", disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 p-3 rounded-md ${
        disabled 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : `${color} hover:opacity-90 hover:shadow-md`
      } transition-all duration-300 w-full`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Helper function to format date in Nepali BS format
  const formatDate = (dateString) => {
    if (!dateString) return 'मिति उपलब्ध छैन';
    return formatNepaliDate(dateString);
  };

  // Department File Chart configuration
  const chartData = {
    labels: stats.departmentFiles.map(item => item.department),
    datasets: [
      {
        label: 'फाइलहरूको संख्या',
        data: stats.departmentFiles.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          callback: function(value) {
            return toNepaliDigits(value);
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#ED772F] border-r-transparent"></div>
      </div>
    );
  }

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
    <div className="p-4 md:p-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl shadow-sm mb-8 border border-orange-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              स्वागतम्! डाश्बोर्डमा
            </h1>
            <p className="text-gray-600">
              फाइल ट्र्याकिंग प्रणालीको वर्तमान स्थिति र विवरणहरू यहाँ हेर्न सक्नुहुन्छ
            </p>
          </div>
          <div className="flex items-center justify-center bg-white p-3 rounded-lg shadow-sm">
            <div className="text-center">
              <FaRegClock className="text-orange-500 text-xl mx-auto" />
              <div className="text-sm mt-1">{currentNepaliDate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="जम्मा फाइलहरू"
          value={stats.totalFiles}
          icon={<FaFile size={24} className="p-3 rounded-full bg-blue-100 text-blue-500" />}
          color="border-blue-500"
          onClick={() => handleAction("status")}
        />
        
        <StatCard 
          title="प्रक्रियामा रहेका फाइलहरू"
          value={stats.pendingFiles}
          icon={<MdPending size={24} className="p-3 rounded-full bg-amber-100 text-amber-500" />}
          color="border-amber-500"
          onClick={() => level !== "1" ? handleAction("nontransfer") : handleAction("status")}
        />
        
        {/* Only show transferred files card for level 2 and above */}
        {level !== "1" && (
          <StatCard 
            title="स्थानान्तरण गरिएका फाइलहरू" 
            value={stats.transferredFiles} 
            icon={<RiFileTransferFill size={24} className="p-3 rounded-full bg-green-100 text-green-500" />}
            color="border-green-500"
            onClick={() => handleAction("transferred")}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 lg:mb-0 col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaExchangeAlt className="text-[#ED772F]" /> द्रुत कार्यहरू
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {level === "1" && (
              <ActionButton 
                label="नयाँ फाइल अपलोड गर्नुहोस्" 
                icon={<FaFileUpload />} 
                onClick={() => handleAction("upload")} 
                color="bg-orange-50 text-orange-600" 
              />
            )}
            
            <ActionButton 
              label="फाइलको स्थिति हेर्नुहोस्" 
              icon={<FaSearch />} 
              onClick={() => handleAction("status")} 
              color="bg-blue-50 text-blue-600" 
            />
            
            {level !== "1" && (
              <>
                <ActionButton 
                  label="स्थानान्तरण नगरिएको फाइल" 
                  icon={<FaFileAlt />} 
                  onClick={() => handleAction("nontransfer")} 
                  color="bg-yellow-50 text-yellow-600" 
                />
                
                {/* Only show transferred files action button for level 2 and above */}
                <ActionButton 
                  label="स्थानान्तरण गरिएको फाइल" 
                  icon={<RiFileTransferFill />} 
                  onClick={() => handleAction("transferred")} 
                  color="bg-green-50 text-green-600" 
                />
                
                <ActionButton 
                  label="फाइल अनुरोध गर्नुहोस्" 
                  icon={<FaFile />} 
                  onClick={() => handleAction("request")} 
                  color="bg-green-50 text-green-600" 
                />
              </>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <FaInfoCircle className="text-blue-500 mt-1 mr-2" />
              <p className="text-sm text-blue-700">
                फाइल ट्र्याकिंग सिस्टमले तपाईंलाई फाइलहरूको स्थिति ट्र्याक गर्न, फाइलहरू व्यवस्थापन गर्न र सुरक्षित रूपमा स्थानान्तरण गर्न मद्दत गर्छ。
              </p>
            </div>
          </div>
        </div>

        {/* Recent File Activity with Graph */}
        <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FaChartLine className="text-[#ED772F]" /> हालैका फाइल गतिविधिहरू
            </h2>
            {/* Only show chart toggle for level 4 (admin) users */}
            {(level === "4" || level === "admin") && (
              <div className="flex items-center">
                <button 
                  onClick={() => setShowChart(!showChart)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  <FaChartBar /> {showChart ? 'तालिका देखाउनुहोस्' : 'चार्ट देखाउनुहोस्'}
                </button>
              </div>
            )}
          </div>

          {/* Show chart only for level 4 (admin) users AND when showChart is true */}
          {(level === "4" || level === "admin") && showChart ? (
            <div className="mt-2">
              {stats.departmentFiles && stats.departmentFiles.length > 0 ? (
                <div className="h-80 w-full">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  विभाग अनुसार फाइलहरूको डाटा उपलब्ध छैन
                </div>
              )}
            </div>
          ) : (
            // Show table for everyone
            stats.recentUploads && stats.recentUploads.length > 0 ? (
              <div className="overflow-hidden">
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
                    {stats.recentUploads.map((file, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.file_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.file_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(file.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            file.status === 'transferred' ? 'bg-green-100 text-green-800' : 
                            file.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {file.status === 'transferred' ? 'स्वीकृत' : 
                            file.status === 'pending' ? 'प्रक्रियामा' : file.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                कुनै हालैको फाइल गतिविधि फेला परेन
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FaBell className="text-[#ED772F]" /> हालैका सूचनाहरू
          </h2>
          <button 
            onClick={() => handleAction("notification")}
            className="text-sm text-[#ED772F] hover:underline"
          >
            सबै हेर्नुहोस्
          </button>
        </div>

        {recentNotifications && recentNotifications.length > 0 ? (
          <div className="space-y-4">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className={`p-2 rounded-full ${notification.is_read ? 'bg-gray-100' : 'bg-orange-100'}`}>
                  <FaBell className={notification.is_read ? 'text-gray-500' : 'text-orange-500'} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.is_read ? 'text-gray-700' : 'text-black font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(notification.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            कुनै हालैको सूचना फेला परेन
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">फाइल ट्र्याकिंग सिस्टमको बारेमा</h3>
        <p className="text-gray-600">
          फाइल ट्र्याकिंग सिस्टम (FTS) एउटा डिजिटल समाधान हो जसले फाइलहरू कुशलतापूर्वक व्यवस्थापन, अनुगमन र ट्र्याक गर्न मद्दत गर्छ。
          यसले अपलोड, डाउनलोड वा परिमार्जित फाइलहरूको रियल-टाइम ट्र्याकिंग प्रदान गरेर सुरक्षा, पारदर्शिता र कागजात व्यवस्थापनमा सुधार गर्छ。
        </p>
      </div>
    </div>
  );
};

export default EmployeeHome;
