import React, { useContext, useState } from 'react';
import styles from './PlaylistsTab.module.css';

import { PlaylistsContext } from '../context/PlaylistsContext';
import { Playlists, PlaylistBreadcrumbs, PlaylistTracks } from './Playlist';
import { AddButton } from './Button';
import { CreatePlayListModal } from './Playlist';

export const PlaylistsTab = ({ }) => {
    const context = useContext(PlaylistsContext);
    const [selected, setSelected] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleTrackRemove = (playlistId, playlistTrackId) => {
        context.removeTrack(playlistId, playlistTrackId)
            .then(() => {
                // sendToast("Track removed", 10000);
                // force refresh
                setSelected({...selected})
            });
    }

    return (
        <div className={styles.tab}>
            <div className={styles.breadcrumbsRow}>
              <PlaylistBreadcrumbs playlist={selected} setSelected={setSelected} />
              {!selected && (
                <div className={styles.createAction}>
                  <AddButton onClick={() => setShowCreateModal(true) } />
                  {showCreateModal && <CreatePlayListModal onClose={() => setShowCreateModal(false)} />}
                </div>
              )}
            </div>
            {selected
                ? <PlaylistTracks playlist={selected} onRemove={handleTrackRemove} />
                : <Playlists items={context.playlists} onRemove={context.remove} onSelect={setSelected} />
            }
        </div>
    );
};

export default PlaylistsTab;