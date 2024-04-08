import { createContext, useState, useContext, useCallback } from "react";
import { PlaylistsContext } from "./PlaylistsContext";
import { Playlists } from "../components/Playlist";
import { ModalDialog } from "../components/Modal";

export const PlaylistSelectModalContext = createContext();
export const CancelledError = new Error('cancelled');

export const PlaylistSelectModalContextProvider = ({ children }) => {
  const playlistContext = useContext(PlaylistsContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [promiseMethods, setPromiseMethods] = useState({});

  const select = useCallback(() => {
    if (promiseMethods.resolve) return;

    return new Promise((resolve, reject) => {
      setShowModal(true);
      setPromiseMethods({ resolve, reject });
    });

  }, [promiseMethods]);

  const handleSelect = useCallback((playlist) => {
    setSelectedPlaylist(playlist === selectedPlaylist ? null : playlist);
  }, [selectedPlaylist]);

  const handleOk = useCallback(() => {
    if (promiseMethods.resolve == undefined) return;
    promiseMethods.resolve(selectedPlaylist);

    setSelectedPlaylist(null);
    setShowModal(false);
    setPromiseMethods({});
  }, [promiseMethods, selectedPlaylist])

  const handleCancel = useCallback(() => {
    if (promiseMethods.reject == undefined) return;
    promiseMethods.reject(CancelledError);

    setSelectedPlaylist(null);
    setShowModal(false);
    setPromiseMethods({});
  }, [promiseMethods]);

  const expose = {
    select,
    CancelledError,
  }

  return (
    <PlaylistSelectModalContext.Provider value={expose}>
      {children}
      {showModal && (
        <ModalDialog onCancel={handleCancel} onOk={handleOk}
          header={<h1>Select a Playlist</h1>}
          okTitle="Confirm"
          okDisabled={!selectedPlaylist}
        >
          <Playlists items={playlistContext.playlists} selected={selectedPlaylist} onSelect={handleSelect} />
        </ModalDialog>
      )}
    </PlaylistSelectModalContext.Provider>
  );
}
