import React from "react";
import styles from "./App.module.css";

import useTabs from "./hooks/useTabs";
import { TracksContextProvider } from "./context/TracksContext";
import { PlaylistsContextProvider } from "./context/PlaylistsContext";
import { PlayerContextProvider } from "./context/PlayerContext"
import { ToastContextProvider } from "./context/ToastContext"

import { TracksTab } from "./components/TracksTab";
import { PlaylistsTab } from "./components/PlaylistsTab";
import { NowPlaying } from "./components/Player";
import { NavigationStrip } from "./components/NavigationStrip";
import { PlaylistSelectModalContextProvider } from "./context/PlaylistSelectModalContext";
import { Toast } from "./components/Modal";

const TAB_TRACKS = 0;
const TAB_PLAYLISTS = 1;

const tabs = {
  [TAB_TRACKS]: "Tracks",
  [TAB_PLAYLISTS]: "Playlists",
};

function App() {
  const { activeTab, currentIndex, changeTab } = useTabs({
    [TAB_TRACKS]: <TracksTab />,
    [TAB_PLAYLISTS]: <PlaylistsTab />,
  }, TAB_TRACKS);

  return (
    <>
      <ToastContextProvider>
        <PlayerContextProvider>
          <main className={styles.app}>
            <NavigationStrip tabs={tabs} currentIndex={currentIndex} changeTab={changeTab} />
            <TracksContextProvider>
              <PlaylistsContextProvider>
                <PlaylistSelectModalContextProvider>
                  {activeTab}
                </PlaylistSelectModalContextProvider>
              </PlaylistsContextProvider>
            </TracksContextProvider>
          </main>
          <div className={styles.sticky}>
            <Toast />
            <NowPlaying />
          </div>
        </PlayerContextProvider>
      </ToastContextProvider>
    </>
  );
}

export default App;
