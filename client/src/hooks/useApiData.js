import { useState, useEffect, useCallback, useReducer } from "react";
import useApiHost from "./useApiHost";

const initialState = { data: null, state: 'idle', errorMsg: "" };

export const useApiData = (uri, autoload, refresh) => {
  const apiHost = useApiHost();

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'started': return { ...state, state: 'pending' };
      case 'success': return { ...state, state: 'resolved', data: action.data };
      case 'error': return { ...state, state: 'rejected', errorMsg: action.error };
      case 'reset': return { ...initialState };
    }
  }, { ...initialState });

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const load = useCallback((withReset) => {
    if (withReset) {
      dispatch({ type: 'reset' });
    }

    if (!uri) return;

    dispatch({ type: 'started' })
    fetch(`${apiHost}/${uri}.json`, { mode: "cors" })
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'success', data: data }))
      .catch((err) => dispatch({ type: 'error', error: err.message }));

  }, [uri])

  useEffect(() => {
    if (autoload) {
      load();
    }
  }, [load, autoload, refresh]);

  return {
    data: state.data,
    isLoading: state.state === 'pending' || state.state === 'idle',
    errorMsg: state.errorMsg,
    load,
    reset
  }
}

export default useApiData;
