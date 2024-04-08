import { useState, useEffect, useCallback, useReducer } from "react";
import useApiHost from "./useApiHost";

const initialState = { data: null, state: 'idle', errorMsg: "" };

export const useData = ({ url, options, autoload, refresh }) => {
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

    if (!url) return;

    dispatch({ type: 'started' })
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => dispatch({ type: 'success', data: data }))
      .catch((err) => dispatch({ type: 'error', error: err.message }));

  }, [url])

  useEffect(() => {
    if (autoload) {
      load();
    }
  }, [url, load, autoload, refresh]);

  return {
    ...state,
    isLoading: state.state === 'pending' || state.state === 'idle',
    load,
    reset
  }
}

export default useData;
