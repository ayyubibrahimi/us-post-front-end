// components/ChatModal.tsx
import React, { useState } from 'react';
import ChatBox from './ChatBox';
import styles from './ChatModal.module.scss';

const ChatModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button className={styles.openButton} onClick={handleOpen}>
        Chat with the Data
      </button>
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.closeButton} onClick={handleClose}>&times;</span>
            <ChatBox onClose={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
