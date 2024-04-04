import React, { useContext, useState } from 'react';

import { PlaylistsContext } from '../context/PlaylistsContext';
import { Playlists, PlaylistBreadcrumbs, PlaylistTracks } from './Playlist';
import useToasts from '../hooks/useToasts';

export const PlaylistsTab = ({ }) => {
    const context = useContext(PlaylistsContext);
    const { sendToast } = useToasts();
    const [selected, setSelected] = useState(null);

    const handleTrackRemove = (playlistId, playlistTrackId) => {
        context.removeTrack(playlistId, playlistTrackId)
            .then(() => {
                // sendToast("Track removed", 10000);
                // force refresh
                setSelected({...selected})
            });
    }

    return (
        <div className="playlistsTab">
            <PlaylistBreadcrumbs playlist={selected} setSelected={setSelected} />
            {selected
                ? <PlaylistTracks playlist={selected} onRemove={handleTrackRemove} />
                : (<>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); context.create({ name: e.currentTarget.name.value }) }}>
                            <input type="text" name="name" placeholder="Playlist Name" />
                            <button type="submit">New</button>
                        </form>
                    </div>
                    <Playlists items={context.playlists} onRemove={context.remove} onSelect={setSelected} />
                </>)
            }
        </div>
    );
};

export default PlaylistsTab;