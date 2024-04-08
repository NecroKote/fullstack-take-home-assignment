import React, { useContext } from 'react';
import { TracksContext } from '../context/TracksContext';
import { PlayerContext } from '../context/PlayerContext';
import { TracksList } from './Tracks';
import { PlaceholderLoader } from './Loader';

export const TracksTab = ({ }) => {
  const { tracks, isLoading } = useContext(TracksContext);

  return (
    <div className="TracksTab">
      <PlaceholderLoader isLoading={isLoading} />
      <TracksList tracks={tracks} showPlay={true} showAddToPlaylist={true} />
    </div>
  );
};

export default TracksTab;