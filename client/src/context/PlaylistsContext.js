import { useState, createContext, useEffect, useCallback } from 'react';
import useApiHost from '../hooks/useApiHost';

export const PlaylistsContext = createContext();

export const PlaylistsContextProvider = ({ children }) => {
  const apiHost = useApiHost();

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const refresh = useCallback(() => {
    setIsLoading(true);
    return fetch(`${apiHost}/playlists/`, { mode: "cors" })
      .then((res) => res.json())
      .then((res) => {
        setPlaylists(res);
        setIsLoading(false);
        return res
      })
      .catch((err) => {
        setErrorMsg(err.message)
        setIsLoading(false);
      })
  }, [apiHost]);

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
    return fetch(`${apiHost}/playlists/${id}`, {
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
    }).then(refresh);
  }, [apiHost])

  const removeTrack = useCallback((playlistId, playlistTrackId) => {
    return fetch(`${apiHost}/playlists/${playlistId}/tracks/${playlistTrackId}/`, {
      method: "DELETE",
    }).then(refresh);
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


  useEffect(() => {
    refresh()
  }, [refresh]);

  const exposed = {
    playlists,
    isLoading,
    errorMsg,
    refresh,
    create,
    remove,
    addTrack,
    removeTrack,
    switchTracks,
  }

  return (
    <PlaylistsContext.Provider value={exposed}>
      {children}
    </PlaylistsContext.Provider>
  );
};
