import axios from "axios";
import axiosRetry from "axios-retry";

import logger from "../utils/logger.js";

import { apiBaseUrl } from "./urls";
import { ACCESS_TOKEN } from "../constants/storageConstants.js";

const apiInstance = () => {
  const api = axios.create({
    baseURL: apiBaseUrl,
  });
  axiosRetry(api, { retries: 3 });

  api.interceptors.request.use(async (config) => {
    config.baseURL = apiBaseUrl;

    const authToken = localStorage.getItem(ACCESS_TOKEN);
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    logger.log("REQUEST", config);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      logger.log("RESPONSE", response);
      return response;
    },
    (error) => {
      logger.log("ERROR", error, error.response);
      throw error.response;
    }
  );

  return api;
};

const apiClient = apiInstance();

export default apiClient;