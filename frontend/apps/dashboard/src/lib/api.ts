import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserDto,
  DomainDto,
  ConversationDto,
  PaginatedResponse,
  PaginationParams,
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if running in browser)
    if (typeof window !== 'undefined') {
      // Get token from Zustand store or localStorage
      const token = useAuthStore.getState().accessToken || localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (config.url && !config.url.includes('/auth/login') && !config.url.includes('/auth/register')) {
        // Log missing token for debugging (but not for auth endpoints)
        console.warn(`[API] No token found for request to ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const { refreshToken } = useAuthStore.getState();
        const storedRefreshToken = refreshToken || localStorage.getItem('refresh_token');
        
        if (storedRefreshToken) {
          // Send the old access token in Authorization header so backend can extract user info
          const oldToken = useAuthStore.getState().accessToken || localStorage.getItem('access_token');
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken: storedRefreshToken,
          }, {
            headers: oldToken ? {
              Authorization: `Bearer ${oldToken}`
            } : {}
          });
          
          // Map response from backend (PascalCase to camelCase)
          const accessToken = response.data.accessToken || response.data.AccessToken;
          const refreshTokenNew = response.data.refreshToken || response.data.RefreshToken;
          const user = response.data.user || response.data.User;
          
          // Update stored tokens in both localStorage and Zustand store
          const { setAuth } = useAuthStore.getState();
          if (user && accessToken && refreshTokenNew) {
            setAuth(user, accessToken, refreshTokenNew);
          } else if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            if (refreshTokenNew) {
              localStorage.setItem('refresh_token', refreshTokenNew);
            }
          }
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        } else {
          // No refresh token available
          throw new Error('No refresh token');
        }
      } catch (refreshError: any) {
        // Refresh failed - clear auth and redirect to login
        console.warn('Token refresh failed:', refreshError);
        
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const isOnDashboard = currentPath.startsWith('/dashboard');
          const isRedirecting = sessionStorage.getItem('auth_redirecting');
          
          // Only redirect if we're on dashboard and not already redirecting
          if (isOnDashboard && !isRedirecting) {
            useAuthStore.getState().clearAuth();
            sessionStorage.setItem('auth_redirecting', 'true');
            setTimeout(() => {
              sessionStorage.removeItem('auth_redirecting');
              if (window.location.pathname.startsWith('/dashboard')) {
                window.location.href = '/login';
              }
            }, 100);
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe API client with proper error handling
 */
export const api = {
  // Auth endpoints
  auth: {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<any>('/auth/register', data);
      // Map PascalCase from backend to camelCase for frontend
      return {
        user: response.data.user || response.data.User,
        accessToken: response.data.accessToken || response.data.AccessToken,
        refreshToken: response.data.refreshToken || response.data.RefreshToken,
      };
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<any>('/auth/login', data);
      // Map PascalCase from backend to camelCase for frontend
      return {
        user: response.data.user || response.data.User,
        accessToken: response.data.accessToken || response.data.AccessToken,
        refreshToken: response.data.refreshToken || response.data.RefreshToken,
      };
    },

    getCurrentUser: async (): Promise<UserDto> => {
      const response = await apiClient.get<UserDto>('/auth/me');
      return response.data;
    },

    refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
      const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    },
  },

  // Domains endpoints
  domains: {
    getAll: async (params?: PaginationParams): Promise<any> => {
      const response = await apiClient.get('/domains', {
        params,
      });
      return response.data;
    },

    getById: async (id: string): Promise<DomainDto> => {
      const response = await apiClient.get<DomainDto>(`/domains/${id}`);
      return response.data;
    },

    create: async (data: { domainUrl: string }): Promise<DomainDto> => {
      const response = await apiClient.post<DomainDto>('/domains', data);
      return response.data;
    },

    createAgent: async (data: any): Promise<DomainDto> => {
      const response = await apiClient.post<DomainDto>('/domains/agent', data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/domains/${id}`);
    },
  },

  // Conversations endpoints
  conversations: {
    getAll: async (
      params?: PaginationParams
    ): Promise<any> => {
      const response = await apiClient.get(
        '/conversations',
        { params }
      );
      return response.data;
    },

    getById: async (id: string): Promise<ConversationDto> => {
      const response = await apiClient.get<ConversationDto>(`/conversations/${id}`);
      return response.data;
    },
  },

  // Documents (Knowledge Base) endpoints
  documents: {
    getAll: async (params?: PaginationParams): Promise<any> => {
      const response = await apiClient.get('/documents', { params });
      return response.data;
    },

    getById: async (id: string): Promise<any> => {
      const response = await apiClient.get(`/documents/${id}`);
      return response.data;
    },

    upload: async (formData: FormData): Promise<any> => {
      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/documents/${id}`);
    },
  },

  // Dashboard endpoints
  dashboard: {
    getStats: async (): Promise<any> => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    },

    getAnalytics: async (): Promise<any> => {
      const response = await apiClient.get('/dashboard/analytics');
      return response.data;
    },

    getSystemHealth: async (): Promise<any> => {
      const response = await apiClient.get('/dashboard/system-health');
      return response.data;
    },
  },

  // User profile endpoints
  users: {
    getProfile: async (): Promise<any> => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },

    updateProfile: async (data: any): Promise<any> => {
      const response = await apiClient.put('/users/profile', data);
      return response.data;
    },

    changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<any> => {
      const response = await apiClient.put('/users/password', data);
      return response.data;
    },

    getSessions: async (): Promise<any> => {
      const response = await apiClient.get('/users/sessions');
      return response.data;
    },

    revokeSession: async (sessionId: string): Promise<any> => {
      const response = await apiClient.delete(`/users/sessions/${sessionId}`);
      return response.data;
    },

    getNotifications: async (): Promise<any> => {
      const response = await apiClient.get('/users/notifications');
      return response.data;
    },

    updateNotifications: async (data: any): Promise<any> => {
      const response = await apiClient.put('/users/notifications', data);
      return response.data;
    },
  },

  // Billing endpoints
  billing: {
    getSubscription: async (): Promise<any> => {
      const response = await apiClient.get('/billing/subscription');
      return response.data;
    },

    getPaymentMethods: async (): Promise<any> => {
      const response = await apiClient.get('/billing/payment-methods');
      return response.data;
    },

    getInvoices: async (): Promise<any> => {
      const response = await apiClient.get('/billing/invoices');
      return response.data;
    },
  },

  // API Keys endpoints
  apiKeys: {
    getAll: async (): Promise<any> => {
      const response = await apiClient.get('/api-keys');
      return response.data;
    },

    create: async (data: { name: string }): Promise<any> => {
      const response = await apiClient.post('/api-keys', data);
      return response.data;
    },

    revoke: async (id: string): Promise<any> => {
      const response = await apiClient.delete(`/api-keys/${id}`);
      return response.data;
    },
  },
};

export default apiClient;

