import React, { useContext } from 'react';
import { TracksContext } from '../context/TracksContext';
import { PlayerContext } from '../context/PlayerContext';
import { TracksList } from './Tracks';
import { PlaceholderLoader } from './Loader';

export const TracksTab = ({}) => {
    const { tracks, isLoading } = useContext(TracksContext);
    const { playTrack } = useContext(PlayerContext);

    return (
        <div className="TracksTab">
            <PlaceholderLoader isLoading={isLoading}/>
            <TracksList tracks={tracks} handlePlay={playTrack} />
        </div>
    );
};

export default TracksTab;