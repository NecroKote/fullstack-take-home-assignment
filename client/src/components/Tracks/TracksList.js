import React from "react";
import styles from "./TracksList.module.css";

import { List, ListRow } from "../List";
import { PlayTrackButton } from "../Player";
import { AddToPlaylistButton } from "../Playlist";


export function TracksList({ tracks, showPlay, showAddToPlaylist }) {
  return (
    <List className={styles.tracksList}>
      {tracks.map((track) => (
        <ListRow key={track.id}
          title={track.title}
          subtitle={track.main_artists.join(", ")}
          actions={showPlay && <PlayTrackButton track={track} />}
          secondaryActions={showAddToPlaylist && <AddToPlaylistButton track={track} />} />
      ))}
    </List>
  )
}

export default TracksList;