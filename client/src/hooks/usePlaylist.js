import { useApiData } from "./useApiData";

export const usePlaylistTracks = ({ playlistId, autoload, refresh }) => useApiData({ uri: `playlists/${playlistId}/tracks`, autoload, refresh });
