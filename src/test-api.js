// Test API endpoints
const baseUrl = 'http://ace-g:8000/api';

async function testAPIs() {
  console.log('Testing API endpoints...');
  
  // Test provinces
  try {
    console.log('Testing provinces endpoint:', `${baseUrl}/provinces/`);
    const response = await fetch(`${baseUrl}/provinces/`);
    if (response.ok) {
      const data = await response.json();
      console.log('Provinces success:', data.length, 'items');
    } else {
      console.log('Provinces failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('Provinces error:', error.message);
  }
  
  // Test districts (assuming province ID 1 exists)
  try {
    console.log('Testing districts endpoint:', `${baseUrl}/districts/1/`);
    const response = await fetch(`${baseUrl}/districts/1/`);
    if (response.ok) {
      const data = await response.json();
      console.log('Districts success:', data.length, 'items');
    } else {
      console.log('Districts failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('Districts error:', error.message);
  }
}

// Run test when this file is imported
testAPIs();
