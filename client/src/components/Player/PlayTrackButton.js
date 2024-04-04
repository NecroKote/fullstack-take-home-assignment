import React, { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import PlayPauseButton from "./PlayPauseButton";

export const PlayTrackButton = ({ className, track }) => {
    const { currentTrack, isPlaying, playTrack, pause } = useContext(PlayerContext);
    const trackIsPlaying = ((currentTrack && currentTrack.id === track.id) || false) && isPlaying;

    const togglePlay = () => {
      if (trackIsPlaying) {
        pause()
      } else {
        playTrack({...track});
      }
    }


    return (
      <PlayPauseButton className={className} isPlaying={trackIsPlaying} onClick={togglePlay} />
    );
}

export default PlayTrackButton;