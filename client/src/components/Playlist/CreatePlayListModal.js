import React, { useContext, useState, useCallback } from 'react';
import { PlaylistsContext } from '../../context/PlaylistsContext';
import useToasts from '../../hooks/useToasts';
import { ModalDialog } from '../Modal';
import styles from './CreatePlayListModal.module.css';

export const CreatePlayListModal = ({ onClose }) => {
  const { create } = useContext(PlaylistsContext);
  const [name, setName] = useState('');
  const { sendToast } = useToasts();

  const createNewPlaylist = useCallback(() => {
    return create({ name }).then(() => {
      sendToast(`Playlist '${name}' created`, 5000);
      onClose && onClose();
    });
  }, [name]);

  const handleCancel = useCallback((e) => {
    setName('');
    onClose && onClose();
  }, [onClose]);

  return (
    <ModalDialog onOk={createNewPlaylist} onCancel={handleCancel}
      header={<h1>Create a new playlist</h1>}
      okDisabled={!name}
    >
      <div class={styles.inputRow}>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </ModalDialog>
  );
};
