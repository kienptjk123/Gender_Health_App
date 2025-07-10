import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Base URL
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://ec2-52-221-179-12.ap-southeast-1.compute.amazonaws.com";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const { access_token, refresh_token: newRefreshToken } =
          response.data?.result || {};

        if (access_token) {
          await AsyncStorage.setItem("access_token", access_token);
          if (newRefreshToken) {
            await AsyncStorage.setItem("refresh_token", newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch {
        // Clear tokens and redirect to login
        await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
        console.log("Token refresh failed, redirecting to login...");
      }
    }

    return Promise.reject(error);
  }
);

export const apiService = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => api.get(url, config),

  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => api.post(url, data, config),

  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => api.put(url, data, config),

  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => api.delete(url, config),

  patch: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => api.patch(url, data, config),

  getPublic: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const publicConfig = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };
    return axios.get(`${API_BASE_URL}${url}`, publicConfig);
  },
};

export default api;
