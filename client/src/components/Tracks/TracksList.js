import React from "react";
import styles from "./TracksList.module.css";

import { List } from "../List";
import PlayTrackButton from "../Player/PlayTrackButton";
import { AddToPlaylistButton } from "../Playlist";

export function TracksList ({tracks, handlePlay}) {
	const showPlay = !!handlePlay;

	return (
		<List
			className={styles.tracksList}
			items={tracks}
			itemActions={(tr, ix) => showPlay && (
				<PlayTrackButton className={styles.playButton} track={tr} />
			)}
			itemSecondaryActions={(tr, ix) => (
				<AddToPlaylistButton track={tr} />
			)}
			itemTitle={(tr) => tr.title}
			itemSubtitle={(tr) => tr.main_artists.join(", ")}
		/>
	)
}

export default TracksList;