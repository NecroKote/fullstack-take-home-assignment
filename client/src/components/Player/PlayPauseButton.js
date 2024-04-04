import React from "react";
import styles from "./PlayPauseButton.module.css";

export const PlayPauseButton = ({ className, isPlaying, onClick }) => {
  return (
    <button className={styles.playPauseButton + (className ? `  ${className}` : '')} onClick={onClick}>
      {isPlaying ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd"clipRule="evenodd" d="M10 5H7V19H10V5ZM17 5H14V19H17V5Z"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 12L8 5V19L20 12Z"/>
        </svg>
      )}
    </button>
  );
}

export default PlayPauseButton;