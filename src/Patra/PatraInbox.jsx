import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInboxPatras, markAsRead, setFilters } from '../app/patraSlice';
import { FaInbox, FaSearch, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PatraInbox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inbox, filters } = useSelector(state => state.patra);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchInboxPatras({ page: 1, filters }));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handlePatraClick = (patra) => {
    if (patra.status === 'received') {
      dispatch(markAsRead(patra.id));
    }
    navigate(`/patra/${patra.id}`);
  };

  const handlePageChange = (page) => {
    dispatch(fetchInboxPatras({ page, filters }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ne-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'received': { bg: 'bg-blue-100 text-blue-800', text: 'प्राप्त' },
      'read': { bg: 'bg-green-100 text-green-800', text: 'पढिएको' },
      'forwarded': { bg: 'bg-purple-100 text-purple-800', text: 'फर्वार्ड गरिएको' },
      'completed': { bg: 'bg-gray-100 text-gray-800', text: 'सम्पन्न' }
    };
    const statusInfo = statusClasses[status] || { bg: 'bg-gray-100 text-gray-800', text: status };
    return `px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg}`;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'received': 'प्राप्त',
      'read': 'पढिएको',
      'forwarded': 'फर्वार्ड गरिएको',
      'completed': 'सम्पन्न'
    };
    return statusTexts[status] || status;
  };

  const getPriorityText = (priority) => {
    const priorityTexts = {
      'low': 'कम',
      'normal': 'सामान्य',
      'medium': 'मध्यम',
      'high': 'उच्च',
      'urgent': 'अति जरुरी'
    };
    return priorityTexts[priority] || priority;
  };

  if (inbox.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaInbox className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">पत्र इनबक्स</h2>
        </div>
        <div className="text-sm text-gray-600">
          कुल: {inbox.pagination.totalItems} | नपढिएको: <span className="font-medium text-blue-600">{inbox.patras.filter(p => p.status === 'received').length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="पत्रहरू खोज्नुहोस्..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            खोज्नुहोस्
          </button>
        </form>
      </div>

      {/* Error Message */}
      {inbox.error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {inbox.error}
        </div>
      )}

      {/* Patras List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {inbox.patras.length === 0 ? (
          <div className="text-center py-12">
            <FaInbox className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">कुनै पत्रहरू फेला परेन</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    विषय
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    पठाउने व्यक्ति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    स्थिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    प्राथमिकता
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    प्राप्त मिति
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    कार्य
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inbox.patras.map((patra) => (
                  <tr 
                    key={patra.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      patra.status === 'received' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handlePatraClick(patra)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {patra.subject}
                            {patra.status === 'received' && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                            {patra.content}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patra.sender_user_detail?.first_name || patra.sender_department_detail?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patra.sender_department_detail?.name || patra.sender_office_detail?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(patra.status)}>
                        {getStatusText(patra.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patra.priority === 'high' || patra.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        patra.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getPriorityText(patra.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patra.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePatraClick(patra);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <FaEye />
                        <span>हेर्नुहोस्</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {inbox.pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => handlePageChange(inbox.pagination.currentPage - 1)}
              disabled={inbox.pagination.currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              पहिले
            </button>
            {[...Array(inbox.pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === inbox.pagination.currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(inbox.pagination.currentPage + 1)}
              disabled={inbox.pagination.currentPage === inbox.pagination.totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              पछि
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PatraInbox;
