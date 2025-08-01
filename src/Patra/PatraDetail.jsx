import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatraById, markAsRead, transferPatra, clearCurrentPatra } from '../app/patraSlice';
import { FaArrowLeft, FaUser, FaCalendar, FaFlag, FaEye, FaPaperPlane, FaHistory } from 'react-icons/fa';
import TransferDialog from '../Components/patra/TransferDialog';

const PatraDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPatra, currentPatraLoading, currentPatraError, transferring } = useSelector(state => state.patra);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatraById(id));
      // Mark as read when viewing
      dispatch(markAsRead(parseInt(id)));
    }
    
    return () => {
      dispatch(clearCurrentPatra());
    };
  }, [dispatch, id]);

  const handleTransfer = async (transferData) => {
    try {
      console.log('Transfer data:', transferData); // Debug log
      await dispatch(transferPatra({ 
        patraId: id, 
        transferData 
      })).unwrap();
      setShowTransferModal(false);
      // Refresh patra details
      dispatch(fetchPatraById(id));
    } catch (error) {
      console.error('Transfer failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'read': 'bg-green-100 text-green-800',
      'forwarded': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${priorityClasses[priority] || 'bg-gray-100 text-gray-800'}`;
  };

  if (currentPatraLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentPatraError) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {currentPatraError}
        </div>
      </div>
    );
  }

  if (!currentPatra) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">
          Patra not found
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FaPaperPlane className="text-sm" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Patra Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Info */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{currentPatra.subject}</h1>
              <div className="flex space-x-2">
                <span className={getStatusBadge(currentPatra.status)}>
                  {currentPatra.status}
                </span>
                <span className={getPriorityBadge(currentPatra.priority)}>
                  {currentPatra.priority} priority
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{currentPatra.sender_name || currentPatra.sender}</p>
                  <p className="text-sm text-gray-500">{currentPatra.sender_department}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(currentPatra.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <FaFlag className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reference No</p>
                  <p className="font-medium">{currentPatra.reference_number || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold mb-4">Content</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentPatra.content}
              </p>
            </div>
          </div>

          {/* Attachments */}
          {currentPatra.attachments && currentPatra.attachments.length > 0 && (
            <div className="px-6 py-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Attachments</h3>
              <div className="space-y-2">
                {currentPatra.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium">{attachment.name}</p>
                      <p className="text-sm text-gray-500">{attachment.size}</p>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transfer History */}
          {currentPatra.transfer_history && currentPatra.transfer_history.length > 0 && (
            <div className="px-6 py-4 border-t">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FaHistory />
                <span>Transfer History</span>
              </h3>
              <div className="space-y-4">
                {currentPatra.transfer_history.map((transfer, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{transfer.from_user}</span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium">{transfer.to_user}</span>
                      </div>
                      <p className="text-sm text-gray-600">{transfer.department}</p>
                      {transfer.remarks && (
                        <p className="text-sm text-gray-700 mt-1">{transfer.remarks}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transfer.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transfer Dialog */}
        <TransferDialog
          open={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onTransfer={handleTransfer}
          loading={transferring}
          patraSubject={currentPatra?.subject || ''}
        />
      </div>
    </>
  );
};

export default PatraDetail;
