import { useState } from "react";

import logger from "src/utils/logger";

import apiClient from "../apis/apiClient";

const headers = {
  "Content-Type": "application/json",
};

const usePatchQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const patchQuery = async (params) => {
    const {
      url,
      onSuccess = () => {
        logger.log("onSuccess function");
      },
      onFail = () => {
        logger.log("onFail function");
      },
      patchData,
    } = params;
    setLoading(true);

    try {
      const { data: apiData = {} } = await apiClient.patch(url, patchData, {
        headers, // Use shorthand property
      });
      setData(apiData);
      await onSuccess(apiData);
      logger.log(apiData, "patchQuery-success");
    } catch (err) {
      onFail(err);
      logger.log(err, "patchQuery-fail");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    patchQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default usePatchQuery;
