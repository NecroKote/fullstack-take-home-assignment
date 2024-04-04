import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import AudioPlayer from './AudioPlayer';

export const NowPlaying = () => {
    const context = useContext(PlayerContext);

    return (
        <>
            {context.currentTrack && <AudioPlayer onPlayerState={context.onPlayerState} onPlayerProgress={context.onPlayerProgress} track={context.currentTrack} />}
        </>
    );
}

export default NowPlaying;
