// Simple API test to debug provinces endpoint
console.log('Testing provinces API...');

// Get baseUrl from environment
const baseUrl = 'http://ace-g:8000/api';
console.log('Using baseUrl:', baseUrl);

// Test provinces endpoint
fetch(`${baseUrl}/provinces/`)
  .then(response => {
    console.log('Provinces response status:', response.status);
    console.log('Provinces response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Provinces data received:', data);
    console.log('Number of provinces:', Array.isArray(data) ? data.length : 'Not an array');
  })
  .catch(error => {
    console.error('Provinces API error:', error);
    console.error('Error message:', error.message);
  });

// Test with a simple ping to see if server is reachable
fetch(`${baseUrl}/`)
  .then(response => {
    console.log('Base API ping status:', response.status);
  })
  .catch(error => {
    console.error('Base API ping failed:', error);
  });
