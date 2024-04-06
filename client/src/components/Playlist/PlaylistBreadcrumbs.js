import React from "react";
import styles from "./PlaylistBreadcrumbs.module.css";

export const PlaylistBreadcrumbs = ({ playlist, setSelected }) => {

  return (
    <nav name="playlists" className={styles.container}>
      <ul className={styles.breadcrumbs}>
        <li key={-1} className={styles.breadcrumb}>
          {playlist
            ? <a href="#" onClick={() => setSelected()}>All</a>
            : <span>All</span>
          }
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
