import axios from 'axios';

/**
 * API Service
 * Centralized service for all backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with defaults
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    console.error('API Error:', message, error);
    return Promise.reject(new Error(message));
  }
);

/**
 * Device API
 */
export const deviceAPI = {
  /**
   * Get all discovered Chromecast devices
   * @returns {Promise<Array>} List of devices
   */
  getAll: () => axiosInstance.get('/devices').then(res => res.data),

  /**
   * Stop playback on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result
   */
  stop: (deviceIds) => axiosInstance.post('/devices/stop', { deviceIds }).then(res => res.data),

  /**
   * Set volume on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @param {number} level - Volume level (0-100)
   * @returns {Promise<Object>} Result
   */
  setVolume: (deviceIds, level) =>
    axiosInstance.post('/devices/volume', { deviceIds, level }).then(res => res.data),
};

/**
 * Slide API
 */
export const slideAPI = {
  /**
   * Get all slides
   * @param {string} [type] - Filter by type (optional)
   * @returns {Promise<Array>} List of slides
   */
  getAll: (type = null) => {
    const params = type ? { type } : {};
    return axiosInstance.get('/slides', { params }).then(res => res.data);
  },

  /**
   * Get single slide by ID
   * @param {string} id - Slide ID
   * @returns {Promise<Object>} Slide object
   */
  getById: (id) => axiosInstance.get(`/slides/${id}`).then(res => res.data),

  /**
   * Create a new slide
   * @param {Object} data - Slide data
   * @param {string} data.name - Slide name
   * @param {string} data.type - Slide type (webpage, youtube, weather, etc.)
   * @param {number} data.duration - Duration in seconds
   * @param {Object} data.config - Type-specific configuration
   * @returns {Promise<Object>} Created slide
   */
  create: (data) => axiosInstance.post('/slides', data).then(res => res.data.slide),

  /**
   * Update a slide
   * @param {string} id - Slide ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated slide
   */
  update: (id, updates) => axiosInstance.put(`/slides/${id}`, updates).then(res => res.data.slide),

  /**
   * Delete a slide
   * @param {string} id - Slide ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => axiosInstance.delete(`/slides/${id}`).then(res => res.data),

  /**
   * Get preview URL for a slide
   * @param {string} id - Slide ID
   * @param {Object} [branding] - Optional branding config
   * @returns {string} Preview URL
   */
  getPreviewUrl: (id, branding = null) => {
    const params = branding ? `?branding=${encodeURIComponent(JSON.stringify(branding))}` : '';
    return `${API_BASE_URL}/slides/${id}/preview${params}`;
  },
};

/**
 * Presentation API
 */
export const presentationAPI = {
  /**
   * Get all presentations
   * @param {boolean} [withSlides=false] - Include full slide details
   * @returns {Promise<Array>} List of presentations
   */
  getAll: (withSlides = false) => {
    const params = withSlides ? { withSlides: 'true' } : {};
    return axiosInstance.get('/presentations', { params }).then(res => res.data);
  },

  /**
   * Get single presentation by ID
   * @param {string} id - Presentation ID
   * @param {boolean} [withSlides=false] - Include full slide details
   * @returns {Promise<Object>} Presentation object
   */
  getById: (id, withSlides = false) => {
    const params = withSlides ? { withSlides: 'true' } : {};
    return axiosInstance.get(`/presentations/${id}`, { params }).then(res => res.data);
  },

  /**
   * Create a new presentation
   * @param {Object} data - Presentation data
   * @param {string} data.name - Presentation name
   * @param {string} [data.description] - Description
   * @param {Array<{slideId: string, duration: number}>} data.slides - Slides in presentation
   * @param {Object} [data.branding] - Branding configuration
   * @param {Object} [data.settings] - Presentation settings
   * @returns {Promise<Object>} Created presentation
   */
  create: (data) => axiosInstance.post('/presentations', data).then(res => res.data.presentation),

  /**
   * Update a presentation
   * @param {string} id - Presentation ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated presentation
   */
  update: (id, updates) => axiosInstance.put(`/presentations/${id}`, updates).then(res => res.data.presentation),

  /**
   * Delete a presentation
   * @param {string} id - Presentation ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => axiosInstance.delete(`/presentations/${id}`).then(res => res.data),

  /**
   * Cast presentation to devices
   * @param {string} id - Presentation ID
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result with player URL
   */
  cast: (id, deviceIds) =>
    axiosInstance.post(`/presentations/${id}/cast`, { deviceIds }).then(res => res.data),

  /**
   * Stop presentation on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result
   */
  stop: (deviceIds) =>
    axiosInstance.post('/presentations/stop', { deviceIds }).then(res => res.data),

  /**
   * Get player URL for a presentation
   * @param {string} id - Presentation ID
   * @returns {string} Player URL
   */
  getPlayerUrl: (id) => `${API_BASE_URL}/presentations/${id}/player`,

  /**
   * Get presentation statistics
   * @returns {Promise<Object>} Statistics
   */
  getStatistics: () => axiosInstance.get('/presentations/statistics').then(res => res.data),
};

/**
 * Group API
 */
export const groupAPI = {
  /**
   * Get all device groups
   * @returns {Promise<Array>} List of groups
   */
  getAll: () => axiosInstance.get('/groups').then(res => res.data),

  /**
   * Create a new group
   * @param {string} name - Group name
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Created group
   */
  create: (name, deviceIds) =>
    axiosInstance.post('/groups', { name, deviceIds }).then(res => res.data.group),

  /**
   * Delete a group
   * @param {string} id - Group ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => axiosInstance.delete(`/groups/${id}`).then(res => res.data),
};

/**
 * Branding API
 */
export const brandingAPI = {
  /**
   * Get branding configuration
   * @returns {Promise<Object>} Branding configuration
   */
  get: () => axiosInstance.get('/branding').then(res => res.data),

  /**
   * Update branding configuration
   * @param {Object} updates - Branding updates
   * @returns {Promise<Object>} Updated branding
   */
  update: (updates) => axiosInstance.put('/branding', updates).then(res => res.data.branding),

  /**
   * Upload branding logo
   * @param {File} file - Logo image file
   * @returns {Promise<string>} Logo URL
   */
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return axiosInstance.post('/branding/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.logoUrl);
  },

  /**
   * Delete branding logo
   * @returns {Promise<Object>} Result
   */
  deleteLogo: () => axiosInstance.delete('/branding/logo').then(res => res.data),

  /**
   * Reset branding to default
   * @returns {Promise<Object>} Default branding
   */
  reset: () => axiosInstance.post('/branding/reset').then(res => res.data.branding),
};

/**
 * System API
 */
export const systemAPI = {
  /**
   * Get system health
   * @returns {Promise<Object>} Health status
   */
  getHealth: () => axiosInstance.get('/health').then(res => res.data),

  /**
   * Get system statistics
   * @returns {Promise<Object>} Statistics
   */
  getStatistics: () => axiosInstance.get('/statistics').then(res => res.data),

  /**
   * Get system logs
   * @param {string} [type='combined'] - Log type (combined, activity, error)
   * @param {number} [lines=100] - Number of lines to retrieve
   * @returns {Promise<Object>} Logs data
   */
  getLogs: (type = 'combined', lines = 100) =>
    axiosInstance.get('/logs', { params: { type, lines } }).then(res => res.data),
};

/**
 * Setup API (Chromecast Configuration Wizard)
 */
export const setupAPI = {
  /**
   * Get comprehensive setup status check
   * @returns {Promise<Object>} Setup check results
   */
  check: () => axiosInstance.get('/setup/check').then(res => res.data),

  /**
   * Get server network information
   * @returns {Promise<Object>} Server info including IP and receiver URL
   */
  getServerInfo: () => axiosInstance.get('/setup/server-info').then(res => res.data),

  /**
   * Get current setup status
   * @returns {Promise<Object>} Setup status
   */
  getStatus: () => axiosInstance.get('/setup/status').then(res => res.data),

  /**
   * Get registration instructions
   * @returns {Promise<Object>} Step-by-step instructions
   */
  getInstructions: () => axiosInstance.get('/setup/instructions').then(res => res.data),

  /**
   * Save Chromecast APP_ID
   * @param {string} appId - The 8-character APP_ID from Google Cast Console
   * @returns {Promise<Object>} Save result
   */
  saveAppId: (appId) => axiosInstance.post('/setup/app-id', { appId }).then(res => res.data),

  /**
   * Test receiver URL accessibility
   * @param {string} url - Receiver URL to test
   * @returns {Promise<Object>} Test result
   */
  testReceiver: (url) => axiosInstance.post('/setup/test-receiver', { url }).then(res => res.data),

  /**
   * Get current .env file content
   * @returns {Promise<Object>} ENV file data
   */
  getEnv: () => axiosInstance.get('/setup/env').then(res => res.data),

  /**
   * Update .env file
   * @param {Object} updates - Key-value pairs to update
   * @returns {Promise<Object>} Update result
   */
  updateEnv: (updates) => axiosInstance.post('/setup/env', { updates }).then(res => res.data),
};

/**
 * Get WebSocket URL
 * @returns {string} WebSocket URL
 */
export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = process.env.REACT_APP_WS_URL || window.location.hostname + ':3001';
  return `${protocol}//${host}`;
};

const api = {
  device: deviceAPI,
  slide: slideAPI,
  presentation: presentationAPI,
  group: groupAPI,
  branding: brandingAPI,
  system: systemAPI,
  setup: setupAPI,
  getWebSocketUrl,
};

export default api;
