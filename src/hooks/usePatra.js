import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchInboxPatras,
  fetchSentPatras,
  fetchPatraById,
  fetchPatraTracking,
  sendPatra,
  transferPatra,
  markPatraAsRead,
  setFilters,
  clearFilters,
  markAsRead,
  clearCurrentPatra,
  clearTracking,
  clearErrors
} from '../app/patraSlice';

export const usePatra = () => {
  const dispatch = useDispatch();
  const patraState = useSelector(state => state.patra);

  // Fetch inbox patras
  const fetchInbox = useCallback((page = 1, filters = {}) => {
    return dispatch(fetchInboxPatras({ page, filters }));
  }, [dispatch]);

  // Fetch sent patras
  const fetchSent = useCallback((page = 1, filters = {}) => {
    return dispatch(fetchSentPatras({ page, filters }));
  }, [dispatch]);

  // Fetch patra by ID
  const fetchPatraDetail = useCallback((patraId) => {
    return dispatch(fetchPatraById(patraId));
  }, [dispatch]);

  // Fetch patra tracking
  const fetchTracking = useCallback((patraId) => {
    return dispatch(fetchPatraTracking(patraId));
  }, [dispatch]);

  // Send new patra
  const sendNewPatra = useCallback((patraData) => {
    return dispatch(sendPatra(patraData));
  }, [dispatch]);

  // Transfer patra
  const transferExistingPatra = useCallback((patraId, transferData) => {
    return dispatch(transferPatra({ patraId, transferData }));
  }, [dispatch]);

  // Set filters
  const updateFilters = useCallback((filters) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  // Clear filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Mark patra as read
  const markPatraAsRead = useCallback((patraId) => {
    dispatch(markAsRead(patraId));
  }, [dispatch]);

  // Clear current patra
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentPatra());
  }, [dispatch]);

  // Clear tracking data
  const clearTrackingData = useCallback(() => {
    dispatch(clearTracking());
  }, [dispatch]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return {
    // State
    ...patraState,
    
    // Actions
    fetchInbox,
    fetchSent,
    fetchPatraDetail,
    fetchTracking,
    sendNewPatra,
    transferExistingPatra,
    updateFilters,
    resetFilters,
    markPatraAsRead,
    clearCurrent,
    clearTrackingData,
    clearAllErrors,
    
    // Computed values
    hasInboxPatras: patraState.inbox.patras.length > 0,
    hasSentPatras: patraState.sent.patras.length > 0,
    isLoading: patraState.inbox.loading || patraState.sent.loading || patraState.currentPatraLoading,
    hasErrors: !!(patraState.inbox.error || patraState.sent.error || patraState.currentPatraError || patraState.sendError || patraState.transferError)
  };
};

export default usePatra;
