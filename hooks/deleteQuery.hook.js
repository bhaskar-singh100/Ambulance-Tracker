import { useState } from "react";

import apiClient from "../apis/apiClient";

const useDeleteQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const deleteQuery = async (params) => {
    const {
      url,
      onSuccess = () => {},
      onFail = () => {},
      deleteData = {},
    } = params;
    setLoading(true);
    try {
      const { data: apiData = {} } = await apiClient.delete(url, {
        data: deleteData,
      });
      setData(apiData);
      await onSuccess(apiData);
      return apiData;
    } catch (err) {
      onFail(err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default useDeleteQuery;
