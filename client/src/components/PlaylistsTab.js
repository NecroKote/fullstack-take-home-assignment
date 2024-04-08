import React, { useContext, useState, useCallback } from 'react';
import styles from './PlaylistsTab.module.css';

import { PlaylistsContext } from '../context/PlaylistsContext';
import { Playlists, PlaylistBreadcrumbs, PlaylistTracks } from './Playlist';
import { AddButton } from './Button';
import { CreatePlayListModal } from './Playlist';
import { PlaceholderLoader } from './Loader';

export const PlaylistsTab = () => {
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { playlists, isLoading, remove, removeTrack, switchTracks } = useContext(PlaylistsContext);

  const handleTrackRemove = useCallback((playlistId, playlistTrackId) => {
    removeTrack(playlistId, playlistTrackId)
      .then(() => {
        // force refresh
        setSelected({ ...selected })
      });
  }, [selected]);

  const handleSwitchPlaces = useCallback((playlistId, from, to, position) => {
    switchTracks(playlistId, from, to, position)
      .then(() => {
        // force refresh
        setSelected({ ...selected });
      });
  }, [selected]);

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
      {selected
        ? <PlaylistTracks playlistId={selected.id} onSwitchPlaces={handleSwitchPlaces} onRemove={handleTrackRemove} />
        : (<>
          <PlaceholderLoader isLoading={isLoading} />
          <Playlists items={playlists} onRemove={remove} onSelect={setSelected} />
        </>)
      }
    </div>
  );
};

export default PlaylistsTab;