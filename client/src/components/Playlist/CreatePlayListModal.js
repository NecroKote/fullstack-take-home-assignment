import React, { useContext, useState, useCallback } from 'react';
import { PlaylistsContextActions } from '../../context/PlaylistsContext';
import useToasts from '../../hooks/useToasts';
import { ModalDialog } from '../Modal';
import styles from './CreatePlayListModal.module.css';

export const CreatePlayListModal = ({ onClose }) => {
  const { create } = useContext(PlaylistsContextActions);
  const { sendToast } = useToasts();
  const [name, setName] = useState('');

  const createNewPlaylist = useCallback(() => {
    return create({ name }).then(() => {
      sendToast(`Playlist '${name}' created`, 5000);
      onClose && onClose();
    });
  }, [create, name]);

  const handleCancel = useCallback(() => {
    setName('');
    onClose && onClose();
  }, [onClose]);

  return (
    <ModalDialog onOk={createNewPlaylist} onCancel={handleCancel}
      header={<h1>Create a new playlist</h1>}
      okDisabled={!name}
    >
      <div className={styles.inputRow}>
        <input type="text" placeholder="Playlist Name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </ModalDialog>
  );
};
