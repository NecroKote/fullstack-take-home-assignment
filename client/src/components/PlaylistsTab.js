import React, { useContext, useState } from 'react';
import styles from './PlaylistsTab.module.css';

import { PlaylistsContext } from '../context/PlaylistsContext';
import { Playlists, PlaylistBreadcrumbs, PlaylistTracks } from './Playlist';
import { AddButton } from './Button';
import { CreatePlayListModal } from './Playlist';
import { PlaceholderLoader } from './Loader';

export const PlaylistsTab = ({ }) => {
  const { playlists, isLoading, remove, removeTrack } = useContext(PlaylistsContext);
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTrackRemove = (playlistId, playlistTrackId) => {
    removeTrack(playlistId, playlistTrackId)
      .then(() => {
        // sendToast("Track removed", 10000);
        // force refresh
        setSelected({ ...selected })
      });
  }

  return (
    <div className={styles.tab}>
      <div className={styles.breadcrumbsRow}>
        <PlaylistBreadcrumbs playlist={selected} setSelected={setSelected} />
        {!selected && (
          <div className={styles.createAction}>
            <AddButton onClick={() => setShowCreateModal(true)} />
            {showCreateModal && <CreatePlayListModal onClose={() => setShowCreateModal(false)} />}
          </div>
        )}
      </div>
      <PlaceholderLoader isLoading={isLoading} />
      {selected
        ? <PlaylistTracks playlist={selected} onRemove={handleTrackRemove} />
        : <Playlists items={playlists} onRemove={remove} onSelect={setSelected} />
      }
    </div>
  );
};

export default PlaylistsTab;