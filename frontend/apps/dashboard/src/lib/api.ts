import axios, { AxiosInstance } from 'axios';
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
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
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
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken } = response.data;
          
          // Update stored token
          localStorage.setItem('access_token', accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
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
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
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
};

export default apiClient;

