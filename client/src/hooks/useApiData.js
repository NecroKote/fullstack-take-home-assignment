import { useState, useEffect, useCallback } from "react";
import useApiHost from "./useApiHost";

export const useApiData = (uri, autoload, refresh) => {
  const apiHost = useApiHost();
  const url = `${apiHost}/${uri}.json`;

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    return fetch(url, { mode: "cors" })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setIsLoading(false);
        return res;
      })
      .catch((err) => {
        setErrorMsg(err.message);
        setIsLoading(false);
      });
  }, [url])

  useEffect(() => {
    if (autoload) {
      load();
    }
  }, [load, autoload, refresh]);

  return {
    data,
    isLoading,
    errorMsg,
    load
  }
}

export default useApiData;
