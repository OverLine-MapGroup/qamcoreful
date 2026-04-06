// Backend URL configuration
const BASE_URL = "https://qamcore-backend-example-production.up.railway.app";

export const api = async (
  url: string,
  options: RequestInit = {}
) => {
  // Get token from Zustand store
  const { useAuthStore } = await import("../store/auth");
  const token = useAuthStore.getState().token;
  

  try {
    const isValidToken = token && token !== "undefined" && token !== "null" && token.length > 10;

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(isValidToken && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle CORS errors
    if (response.type === 'opaque') {
      throw new Error('CORS error: Unable to connect to backend. Please check if backend is running and accessible.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      
      // Handle common error cases
      if (response.status === 0) {
        errorMessage = 'Network error: Unable to connect to backend. Please check your connection and backend URL.';
      } else if (response.status === 401) {
        errorMessage = 'Unauthorized: Please login again.';
        // Clear Zustand store on 401
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

    return response.json();
  } catch (error) {
    // Handle fetch errors (including CORS)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to backend. Please check if backend is running and CORS is properly configured.');
    }
    throw error;
  }
};