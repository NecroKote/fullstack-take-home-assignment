import React, { useContext } from "react";
import { PlaylistsContext } from "../../context/PlaylistsContext";
import { PlaylistSelectModalContext } from "../../context/PlaylistSelectModalContext";
import useToasts from "../../hooks/useToasts";
import { AddButton } from "../Button";

export const AddToPlaylistButton = ({ track }) => {
  const { sendToast } = useToasts();
  const { addTrack } = useContext(PlaylistsContext);
  const { select } = useContext(PlaylistSelectModalContext);

  const handleClick = () => {
    select()
      .then((playlist) => addTrack(playlist.id, track.id).then(() => ({ playlist, track })))
      .then(({ playlist, track }) => {
        sendToast(`Track added to playist '${playlist.name}'`, 5000);
      })
  }

  return <AddButton onClick={handleClick} />
}

export default AddToPlaylistButton;