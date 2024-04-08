import React, { useContext, useState, useCallback, useEffect } from 'react';
import styles from './PlaylistsTab.module.css';

import { PlaylistsContext } from '../context/PlaylistsContext';
import { PlayerContextActions } from '../context/PlayerContext';
import { Playlists, PlaylistBreadcrumbs, PlaylistTracks, CreatePlayListModal } from './Playlist';
import { AddButton, PlayPauseButton } from './Button';
import { PlaceholderLoader } from './Loader';
import { usePlaylistTracks } from "../hooks/usePlaylist";

export const PlaylistsTab = () => {
  const [selected, setSelected] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { playTracks } = useContext(PlayerContextActions)
  const { playlists, isLoading, remove, removeTrack, switchTracks } = useContext(PlaylistsContext);
  const { data: playlistTracks, isLoading: loadingTracks, errorMsg, load, reset } = usePlaylistTracks(selected && selected.id, false, selected);

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

  useEffect(() => selected ? load(true) : reset(), [selected])

  const playlistIsPlyable = !!selected && !loadingTracks && !!(playlistTracks && playlistTracks.length);

  return (
    <div className={styles.tab}>
      <div className={styles.breadcrumbsRow}>
        <PlaylistBreadcrumbs playlist={selected} setSelected={setSelected} />
        <div className={styles.actions}>
          {selected
            ? <PlayPauseButton disabled={!playlistIsPlyable} onClick={() => playTracks(playlistTracks.map(tr => tr.track))} />
            : (
              <>
                <AddButton onClick={() => setShowCreateModal(true)} />
                {showCreateModal && <CreatePlayListModal onClose={() => setShowCreateModal(false)} />}
              </>
            )
          }
        </div>
      </div>
      {selected
        ? (<>
          {errorMsg && <div>Error: {errorMsg}</div>}
          <PlaceholderLoader isLoading={loadingTracks} />
          <PlaylistTracks playlistId={selected.id} tracks={playlistTracks} onSwitchPlaces={handleSwitchPlaces} onRemove={handleTrackRemove} />
        </>)
        : (<>
          <PlaceholderLoader isLoading={isLoading} />
          <Playlists items={playlists} onRemove={remove} onSelect={setSelected} />
        </>)
      }
    </div>
  );
};

export default PlaylistsTab;