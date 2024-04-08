import React, { useContext } from "react";
import { PlayerContextState, PlayerContextActions } from "../../context/PlayerContext";
import { PlayPauseButton } from "../Button";

export const PlayTrackButton = ({ className, track }) => {
  const { currentTrack, isPlaying } = useContext(PlayerContextState);
  const { playTrack, pause } = useContext(PlayerContextActions);
  const trackIsPlaying = ((currentTrack && currentTrack.id === track.id) || false) && isPlaying;

  const togglePlay = () => {
    if (trackIsPlaying) {
      pause()
    } else {
      playTrack({ ...track });
    }
  }

  return (
    <PlayPauseButton className={className} isPlaying={trackIsPlaying} onClick={togglePlay} />
  );
}

export default PlayTrackButton;