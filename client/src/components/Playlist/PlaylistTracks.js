import React, { useContext } from "react";
import styles from "./PlaylistTracks.module.css";

import List from "../List";
import { PlaceholderLoader } from "../Loader";
import PlayTrackButton from "../Player/PlayTrackButton";
import { usePlaylistTracks } from "../../hooks/usePlaylist";
import { DeleteButton } from "../Button";

// DeleteButton

export const PlaylistTracks = ({ playlist, onRemove }) => {
  const { data: tracks, isLoading, errorMsg } = usePlaylistTracks({ playlistId: playlist.id, autoload: true, refresh: playlist });

  return (
    <>
      {errorMsg && <div>Error: {errorMsg}</div>}
      <PlaceholderLoader isLoading={isLoading} />
      {(
        <List
          className={styles.playlistTracks}
          items={tracks}
          noItemsContent={isLoading ? null : <>No tracks in this playlist. Add some from "Tracks"</>}
          itemKey={(tr) => tr.id}
          itemActions={(tr, ix) => (
            <>
              <span className={styles.trackNumber}>#{ix + 1}</span>
              <PlayTrackButton className={styles.playButton} track={tr.track} />
            </>
          )}
          itemSecondaryActions={(tr, ix) => onRemove && <DeleteButton onClick={() => onRemove(playlist.id, tr.id)} />}
          itemTitle={(tr) => tr.track.title}
          itemSubtitle={(tr) => (tr.track.main_artists.join(',') || 'Unknown Artist')}
        />
      )}
    </>
  );
}

export default PlaylistTracks;