import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem('token');

  const request = async (method, endpoint, data = null, showToast = true) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Token ${token}` }),
        },
      };

      if (data) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      if (showToast) {
        toast.error(err.message || 'API अनुरोध असफल');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get: (endpoint, showToast = true) => request('GET', endpoint, null, showToast),
    post: (endpoint, data, showToast = true) => request('POST', endpoint, data, showToast),
    patch: (endpoint, data, showToast = true) => request('PATCH', endpoint, data, showToast),
    delete: (endpoint, showToast = true) => request('DELETE', endpoint, null, showToast),
  };
};
