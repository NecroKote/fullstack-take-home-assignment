import React, { useContext } from 'react';
import { PlayerContextState, PlayerContextActions } from '../../context/PlayerContext';
import AudioPlayer from './AudioPlayer';

export const NowPlaying = () => {
  const { currentTrack, hasNext, hasPrev } = useContext(PlayerContextState);
  const { onPlayerState, onPlayerProgress, playNext, playPrev } = useContext(PlayerContextActions);

  return (
    <>
      {currentTrack && <AudioPlayer
        track={currentTrack}
        onPlayerState={onPlayerState} onPlayerProgress={onPlayerProgress}
        hasNext={hasNext} onPlayNext={playNext}
        hasPrev={hasPrev} onPlayPrev={playPrev}
      />}
    </>
  );
}

export default NowPlaying;
