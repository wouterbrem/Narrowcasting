import axios from 'axios';

/**
 * API Service
 * Centralized service for all backend communication
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling
api.interceptors.response.use(
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
  getAll: () => api.get('/devices').then(res => res.data),

  /**
   * Stop playback on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result
   */
  stop: (deviceIds) => api.post('/devices/stop', { deviceIds }).then(res => res.data),

  /**
   * Set volume on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @param {number} level - Volume level (0-100)
   * @returns {Promise<Object>} Result
   */
  setVolume: (deviceIds, level) =>
    api.post('/devices/volume', { deviceIds, level }).then(res => res.data),
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
    return api.get('/slides', { params }).then(res => res.data);
  },

  /**
   * Get single slide by ID
   * @param {string} id - Slide ID
   * @returns {Promise<Object>} Slide object
   */
  getById: (id) => api.get(`/slides/${id}`).then(res => res.data),

  /**
   * Create a new slide
   * @param {Object} data - Slide data
   * @param {string} data.name - Slide name
   * @param {string} data.type - Slide type (webpage, youtube, weather, etc.)
   * @param {number} data.duration - Duration in seconds
   * @param {Object} data.config - Type-specific configuration
   * @returns {Promise<Object>} Created slide
   */
  create: (data) => api.post('/slides', data).then(res => res.data.slide),

  /**
   * Update a slide
   * @param {string} id - Slide ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated slide
   */
  update: (id, updates) => api.put(`/slides/${id}`, updates).then(res => res.data.slide),

  /**
   * Delete a slide
   * @param {string} id - Slide ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => api.delete(`/slides/${id}`).then(res => res.data),

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
    return api.get('/presentations', { params }).then(res => res.data);
  },

  /**
   * Get single presentation by ID
   * @param {string} id - Presentation ID
   * @param {boolean} [withSlides=false] - Include full slide details
   * @returns {Promise<Object>} Presentation object
   */
  getById: (id, withSlides = false) => {
    const params = withSlides ? { withSlides: 'true' } : {};
    return api.get(`/presentations/${id}`, { params }).then(res => res.data);
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
  create: (data) => api.post('/presentations', data).then(res => res.data.presentation),

  /**
   * Update a presentation
   * @param {string} id - Presentation ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated presentation
   */
  update: (id, updates) => api.put(`/presentations/${id}`, updates).then(res => res.data.presentation),

  /**
   * Delete a presentation
   * @param {string} id - Presentation ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => api.delete(`/presentations/${id}`).then(res => res.data),

  /**
   * Cast presentation to devices
   * @param {string} id - Presentation ID
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result with player URL
   */
  cast: (id, deviceIds) =>
    api.post(`/presentations/${id}/cast`, { deviceIds }).then(res => res.data),

  /**
   * Stop presentation on devices
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Result
   */
  stop: (deviceIds) =>
    api.post('/presentations/stop', { deviceIds }).then(res => res.data),

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
  getStatistics: () => api.get('/presentations/statistics').then(res => res.data),
};

/**
 * Group API
 */
export const groupAPI = {
  /**
   * Get all device groups
   * @returns {Promise<Array>} List of groups
   */
  getAll: () => api.get('/groups').then(res => res.data),

  /**
   * Create a new group
   * @param {string} name - Group name
   * @param {string[]} deviceIds - Array of device IDs
   * @returns {Promise<Object>} Created group
   */
  create: (name, deviceIds) =>
    api.post('/groups', { name, deviceIds }).then(res => res.data.group),

  /**
   * Delete a group
   * @param {string} id - Group ID
   * @returns {Promise<Object>} Result
   */
  delete: (id) => api.delete(`/groups/${id}`).then(res => res.data),
};

/**
 * System API
 */
export const systemAPI = {
  /**
   * Get system health
   * @returns {Promise<Object>} Health status
   */
  getHealth: () => api.get('/health').then(res => res.data),

  /**
   * Get system statistics
   * @returns {Promise<Object>} Statistics
   */
  getStatistics: () => api.get('/statistics').then(res => res.data),
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

export default {
  device: deviceAPI,
  slide: slideAPI,
  presentation: presentationAPI,
  group: groupAPI,
  system: systemAPI,
  getWebSocketUrl,
};
