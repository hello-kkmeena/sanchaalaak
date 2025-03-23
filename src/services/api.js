import axios from 'axios';
import config from '../config/config';

// You can set a default base URL
const DEFAULT_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  // Use environment variable, fallback to default if not set
  baseURL: config.API_URL || DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can also modify the URL here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle other error statuses
    const errorMessage = error.response.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export const userApi = {
  /**
   * Get current user data
   * @returns {Promise<User>}
   */
  getCurrentUser: async () => {
    const response = await api.get('/sanchaalaak/get-details');
    return response.data;
  },
};

export const inventoryApi = {
  /**
   * Get inventory for a store
   * @param {string} storeId
   * @returns {Promise<InventoryItem[]>}
   */
  getStoreInventory: async (storeId) => {
    try {
      const response = await api.get(`/store-manager/store/get-items?storeId=${storeId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch inventory: ${error.message}`);
    }
  },

  getAccessibleStores: async () => {
    const response = await api.get('/stores/accessible');
    return response.data;
  },

  searchCommonItems: async (query,storeId) => {
    const response = await api.get(`/store-manager/common-items?name=${query}`);
    return response.data;
  },

  addItemToStore: async (storeId, item) => {
    const { image, ...itemWithoutImage } = item;
    const response = await api.post(`/store-manager/add-store-item/${storeId}`, itemWithoutImage);
    return response.data;
  },

  updateStoreItem: async (storeId, itemId, updates) => {
    const response = await api.patch(`/stores/${storeId}/inventory/${itemId}`, updates);
    return response.data;
  },

  deleteStoreItem: async (storeId, itemId) => {
    await api.delete(`/store-manager/store-item/delete?itemId=${itemId}`);
  },

  updateStoreItemAvailability: async (storeId, itemId, isAvailable) => {
    const response = await api.patch(`/store-manager/store-item/update/${itemId}`, {
      isAvailable
    });
    
    return {
      success: response.status === 200,
      data: response.data  // This should be the complete updated item object
    };
  },
};