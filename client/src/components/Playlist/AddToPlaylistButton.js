import React, { useContext } from "react";
import { PlaylistsContextActions } from "../../context/PlaylistsContext";
import { PlaylistSelectModalContext } from "../../context/PlaylistSelectModalContext";
import useToasts from "../../hooks/useToasts";
import { AddButton } from "../Button";

export const AddToPlaylistButton = ({ track }) => {
  const { sendToast } = useToasts();
  const { addTrack } = useContext(PlaylistsContextActions);
  const { select, CancelledError } = useContext(PlaylistSelectModalContext);

  const handleClick = () => {
    select()
      .then((playlist) =>
        addTrack(playlist.id, track.id)
          .then(() => sendToast(`Track added to playist '${playlist.name}'`, 5000))
      )
      .catch((e) => {
        if (e != CancelledError) throw e
      })
  }

  return <AddButton onClick={handleClick} />
}

export default AddToPlaylistButton;