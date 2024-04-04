import { useState, createContext, useEffect, useCallback, useMemo, useRef } from 'react';

// TODO: rename to NowPlayingContext
export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
    const [currentPlayerRef, setCurrentPlayerRef] = useState();
    const [currentTrack, setCurrentTrack] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState({ time: -Infinity, duration: +Infinity, progress: 0 });

    const playTrack = useCallback((track) => {
        setCurrentTrack(track);
    }, []);

    const pauseCurrent = useCallback(() => {
        currentPlayerRef && currentPlayerRef.pause();
    }, [currentPlayerRef]);

    const onPlayerState = useCallback((playerRef, isPlaying) => {
        setCurrentPlayerRef(playerRef);
        setIsPlaying(isPlaying);
    }, []);

    const onPlayerProgress = useCallback((progress, time, duration) => {
        setProgress({ time, duration, progress });
    }, []);

    const exposed = useMemo(() => ({
        currentTrack,
        isPlaying,
        playTrack: playTrack,
        pause: pauseCurrent,
        onPlayerState: onPlayerState,
        onPlayerProgress: onPlayerProgress,
    }), [currentTrack, isPlaying]);

    return (
        <PlayerContext.Provider value={exposed}>
            {children}
        </PlayerContext.Provider>
    );
};