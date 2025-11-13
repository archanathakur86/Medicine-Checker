// frontend/src/services/api.js
// Centralized API client using fetch

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const config = {
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!(options.body instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const text = await response.text();
      let message = text;
      try {
        const json = JSON.parse(text);
        message = json.message || text;
      } catch (e) {
        // Keep text message
      }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  // POST multipart/form-data for image verification
  async verify(formData) {
    return this.request('/verify', {
      method: 'POST',
      body: formData,
    });
  }

  // GET medicine by name
  async getMedicineByName(name) {
    return this.request(`/medicine/${encodeURIComponent(name)}`, {
      method: 'GET',
    });
  }
}

export default new ApiClient(API_BASE_URL);
