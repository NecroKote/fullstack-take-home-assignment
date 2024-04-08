import { useState, createContext, useEffect, useCallback, useMemo, useReducer } from 'react';

// TODO: rename to NowPlayingContext
export const PlayerContextState = createContext();
export const PlayerContextActions = createContext();

const initialState = {
  state: 'idle',
  currentTrack: null,
  playlist: { position: -1, tracks: null },
  progress: { time: -Infinity, duration: +Infinity, progress: 0 }
};
const copyInitialState = () => ({ ...initialState, playlist: { ...initialState.playlist }, progress: { ...initialState.progress } });

const playerReducer = (state, action) => {
  switch (action.type) {
    case 'onPlay':
      return { ...state, state: 'playing' };

    case 'onPause':
      return { ...state, state: 'paused' };

    case 'onProgress':
      return { ...state, progress: { ...state.progress, ...action.progress } };

    case 'playTrack':
      return { ...copyInitialState(), currentTrack: action.track };

    case 'playTracks':
      const tracks = action.tracks || [];
      const currentTrack = tracks.length > 0 ? tracks[0] : null;
      return { ...state, currentTrack, playlist: { position: 0, tracks: tracks } };

    case 'next':
      if (!state.playlist.tracks) return state;
      const nextPosition = state.playlist.position + 1;
      if (nextPosition >= state.playlist.tracks.length) return state;
      const nextState = {
        ...state,
        currentTrack: state.playlist.tracks[nextPosition],
        playlist: { ...state.playlist, position: nextPosition }
      };

      return nextState;

    case 'prev':
      if (!state.playlist.tracks) return state;
      const prevPosition = state.playlist.position - 1;
      if (prevPosition < 0) return state;
      const prevState = {
        ...state,
        currentTrack: state.playlist.tracks[prevPosition],
        playlist: { ...state.playlist, position: prevPosition }
      };

      return prevState;

    default:
      console.warn('Unhandled action', action);
  }
  return state;
};

export const PlayerContextProvider = ({ children }) => {
  const [store, dispatch] = useReducer(playerReducer, copyInitialState());
  const [currentPlayerRef, setCurrentPlayerRef] = useState();

  const playTrack = useCallback((track) => {
    dispatch({ type: 'playTrack', track });
  }, []);

  const pause = useCallback(() => {
    currentPlayerRef && currentPlayerRef.pause();
  }, [currentPlayerRef]);

  const onPlayerState = useCallback((playerRef, state) => {
    setCurrentPlayerRef(playerRef);

    dispatch({
      type: {
        play: 'onPlay',
        pause: 'onPause',
        ended: 'next',
      }[state]
    });
  }, [])

  const onPlayerProgress = useCallback((progress, time, duration) => {
    dispatch({ type: 'onProgress', progress: { progress, time, duration } })
  }, []);

  const playTracks = useCallback((tracks) => {
    dispatch({ type: 'playTracks', tracks });
  }, []);

  const playNext = useCallback(() => {
    dispatch({ type: 'next' });
  }, []);

  const playPrev = useCallback(() => {
    dispatch({ type: 'prev' });
  }, []);

  const actions = useMemo(() => ({
    playTrack,
    pause,
    onPlayerState,
    onPlayerProgress,
    playTracks,
    playNext,
    playPrev
  }), [playTrack, pause, onPlayerState, onPlayerProgress, playTracks, playNext, playPrev]);

  return (
    <PlayerContextState.Provider value={{
      ...store,
      isPlaying: store.state === 'playing',
      hasNext: store.playlist.tracks && (store.playlist.position < store.playlist.tracks.length - 1),
      hasPrev: store.playlist.tracks && store.playlist.position > 0,
    }}>
      <PlayerContextActions.Provider value={actions}>
        {children}
      </PlayerContextActions.Provider>
    </PlayerContextState.Provider>
  );
};