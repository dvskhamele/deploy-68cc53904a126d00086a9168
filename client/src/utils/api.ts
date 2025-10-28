// Utility to get the base URL for API calls
// In development, we use the proxy (relative path)
// In production, we need the full URL to the backend

const getApiBaseUrl = () => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    // In development, we use the proxy set up in vite.config.ts
    return '';
  }
  
  // In production, use the environment variable
  // If not set, we'll use a relative path as fallback
  return import.meta.env.VITE_API_BASE_URL || '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  // Construct the full URL
  let url = endpoint;
  
  // If we have a base URL and the endpoint doesn't start with http, prepend the base URL
  if (API_BASE_URL && !endpoint.startsWith('http')) {
    // Ensure we don't double up on slashes
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const endpointPath = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    url = `${baseUrl}${endpointPath}`;
  } else if (!API_BASE_URL && !endpoint.startsWith('http')) {
    // If no base URL is set and we're not in development, 
    // we'll need to determine the API URL based on the current domain
    // For Netlify, we might need to append '/.netlify/functions/' or similar
    // For now, we'll just use the relative path and hope for the best
    url = endpoint;
  }
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    console.log(`Making API call to: ${url}`);
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Handle non-JSON responses
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Export a version number for debugging deployment issues
export const API_UTILS_VERSION = '1.0.1';