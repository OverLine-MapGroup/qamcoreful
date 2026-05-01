import { API_BASE_URL } from "./constants";

export const api = async (
  url: string,
  options: RequestInit = {}
) => {
  const { useAuthStore } = await import("../store/auth");
  const token = useAuthStore.getState().token;
  
  try {
    const isValidToken = true;

    const fullUrl = url.startsWith(API_BASE_URL) ? url : `${API_BASE_URL}${url}`;
    
    const shouldSkipToken = fullUrl.includes('/register-anonymous');
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(!shouldSkipToken && isValidToken && token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (response.type === 'opaque') {
      throw new Error('CORS error: Unable to connect to backend. Please check if backend is running and accessible.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      
      if (response.status === 0) {
        errorMessage = 'Network error: Unable to connect to backend. Please check your connection and backend URL.';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Please login again.';
        useAuthStore.getState().logout();
        window.location.href = '/login';
      } else if (response.status === 403) {
        errorMessage = 'Forbidden: You do not have permission to access this resource.';
      } else if (response.status === 404) {
        errorMessage = 'Not found: The requested resource does not exist.';
      } else if (response.status >= 500) {
        errorMessage = 'Server error: Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    
    if (response.status === 204 || !responseText.trim()) {
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      return responseText;
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to backend. Please check if backend is running and CORS is properly configured.');
    }
    throw error;
  }
};