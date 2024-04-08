import React from "react";
import styles from "./PlaylistTracks.module.css";

import { List, ListRow, ListRowEmpty } from "../List";
import { PlayTrackButton } from "../Player";
import { DeleteButton } from "../Button";

export const PlaylistTracks = ({ playlistId, tracks, onSwitchPlaces, onRemove }) => {

  const onDragSwitchPlaces = (from, to, position) => {
    onSwitchPlaces(playlistId, tracks[from].id, tracks[to].id, position);
  }

  return (
    <>
      <List
        noItemsContent={<ListRowEmpty>No tracks in this playlist. Add some from "Tracks"</ListRowEmpty>}
        draggable={true}
        onDragSwitchPlaces={onDragSwitchPlaces}
      >
        {tracks && tracks.map((tr, ix) => (
          <ListRow
            key={tr.id}
            actions={
              <>
                <span className={styles.trackNumber}>#{ix + 1}</span>
                <PlayTrackButton track={tr.track} />
              </>
            }
            secondaryActions={onRemove && <DeleteButton onClick={() => onRemove(playlistId, tr.id)} />}
            title={tr.track.title}
            subtitle={(tr.track.main_artists.join(',') || 'Unknown Artist')}
          />
        ))}
      </List>
    </>
  );
}

export default PlaylistTracks;