import React, { useRef, useState, useEffect } from "react";
import styles from "./AudioPlayer.module.css";

import { PlayPauseButton, PlayNextButton, PlayPrevButton } from "../Button";

function AudioPlayer({ track, onPlayerState, onPlayerProgress, hasNext, onPlayNext, hasPrev, onPlayPrev, }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlayerState && onPlayerState(audioRef.current, 'play');
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPlayerState && onPlayerState(audioRef.current, 'pause');
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onPlayerState && onPlayerState(audioRef.current, 'ended');
  };

  const handleTimeUpdate = (e) => {
    const progress = e.target.currentTime / e.target.duration;
    setProgress(progress);
    onPlayerProgress && onPlayerProgress(progress, e.target.currentTime, e.target.duration);
  };

  const handleSliderChange = (e) => {
    audioRef.current.currentTime =
      (e.target.value / 1000) * audioRef.current.duration;
  };

  const handleTogglePlaybackClick = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    audioRef.current.play();
    audioRef.current.currentTime = 0;
  }, [track]);

  return (
    <>
      <audio src={track.audio} ref={audioRef} />
      <div className={styles.audioPlayer}>
        <div className={styles.controls}>
          <PlayPrevButton disabled={!hasPrev} className={styles.smallButton} onClick={onPlayPrev} />
          <PlayPauseButton className={styles.playButton} isPlaying={isPlaying} onClick={handleTogglePlaybackClick} />
          <PlayNextButton disabled={!hasNext} className={styles.smallButton} onClick={onPlayNext} />
        </div>
        <div className={styles.albumArt}>
          <img src={track.cover_art} alt={track.title} />
        </div>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{track.title}</div>
          <div className={styles.trackArtist}>
            {track.main_artists.join(", ")}
          </div>
        </div>
        <div className={styles.sliderContainer}>
          <input
            type="range"
            min="1"
            max="1000"
            value={progress ? progress * 1000 : 1000}
            className={styles.slider}
            onChange={handleSliderChange}
          />
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;
