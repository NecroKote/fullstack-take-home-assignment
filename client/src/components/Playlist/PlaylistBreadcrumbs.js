import React from "react";
import styles from "./PlaylistBreadcrumbs.module.css";

export const PlaylistBreadcrumbs = ({ playlist, setSelected }) => {

  return (
    <nav name="playlists" className={styles.container}>
      <ul className={styles.breadcrumbs}>
        <li key={-1} className={styles.breadcrumb}>
          <a href="#" onClick={() => setSelected()}>All</a>
        </li>
        {playlist && (
          <li key={playlist.id}>
            <span>{playlist.name}</span>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default PlaylistBreadcrumbs;
