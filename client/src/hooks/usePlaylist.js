import { useApiData } from "./useApiData";

export const usePlaylistTracks = (playlistId, autoload, refresh) => useApiData(`playlists/${playlistId}/tracks.json`, autoload, refresh);
