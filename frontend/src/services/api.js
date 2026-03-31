import { supabase } from '../supabaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const fetchResource = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'API Request Failed';
    try {
      const errorData = await response.json();
      if (errorData && errorData.detail) {
        // FastAPI typically sends errors under the 'detail' key
        errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
      }
    } catch (e) {
      // Ignored if unable to parse json
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
