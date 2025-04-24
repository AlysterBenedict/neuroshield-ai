
// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Mock auth token (in a real implementation, this would come from an auth context)
const MOCK_AUTH_TOKEN = 'Bearer mock_jwt_token';

// API client for making requests
const apiClient = {
  /**
   * Get sessions history
   */
  getSessions: async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        headers: {
          'Authorization': MOCK_AUTH_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      throw error;
    }
  },
  
  /**
   * Upload assessment files
   */
  uploadAssessment: async (videoBlob: Blob, audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'recording.webm');
      formData.append('audio', audioBlob, 'audio.webm');
      
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': MOCK_AUTH_TOKEN
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to upload assessment:', error);
      throw error;
    }
  },
  
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  },
  
  /**
   * Register new user
   */
  register: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  }
};

export default apiClient;
