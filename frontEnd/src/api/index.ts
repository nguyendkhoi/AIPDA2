import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

//const API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = "https://aipda-web.onrender.com/api";
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log("toke: ", token);
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error("Response Error:", error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn(
          "Unauthorized request. Attempting to refresh token or redirect to login."
        );
      }
      console.error("Resource not found.");
    }

    return Promise.reject(error);
  }
);

export default api;
