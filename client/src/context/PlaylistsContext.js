import { useState, createContext, useEffect, useCallback, useMemo } from 'react';
import useApiHost from '../hooks/useApiHost';
import useApiData from '../hooks/useApiData';

export const PlaylistsContextState = createContext();
export const PlaylistsContextActions = createContext();

export const PlaylistsContextProvider = ({ children }) => {
  const apiHost = useApiHost();

  const { data: playlists, isLoading, errorMsg, load: refresh } = useApiData('playlists/', true);

  const create = useCallback(({ name }) => {
    return fetch(`${apiHost}/playlists/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then(refresh)
  }, [apiHost, refresh])

  const remove = useCallback((id) => {
    return fetch(`${apiHost}/playlists/${id}/`, {
      method: "DELETE",
    }).then(refresh);
  }, [apiHost, refresh])

  const addTrack = useCallback((playlistId, trackId) => {
    return fetch(`${apiHost}/playlists/${playlistId}/tracks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ track: trackId }),
    });
  }, [apiHost])

  const removeTrack = useCallback((playlistId, playlistTrackId) => {
    return fetch(`${apiHost}/playlists/${playlistId}/tracks/${playlistTrackId}/`, {
      method: "DELETE",
    });
  }, [apiHost])

  const switchTracks = useCallback((playlistId, source, destination, position) => {
    return fetch(`${apiHost}/playlists/${playlistId}/tracks/switch_places/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source, destination, position }),
    });
  }, [apiHost])

  const state = useMemo(() => ({
    playlists,
    isLoading,
    errorMsg,
  }), [playlists, isLoading, errorMsg]);

  const actions = useMemo(() => ({
    refresh,
    create,
    remove,
    addTrack,
    removeTrack,
    switchTracks,
  }), [refresh, create, remove, addTrack, removeTrack, switchTracks]);

  return (
    <PlaylistsContextState.Provider value={state}>
      <PlaylistsContextActions.Provider value={actions}>
        {children}
      </PlaylistsContextActions.Provider>
    </PlaylistsContextState.Provider>
  );
};
