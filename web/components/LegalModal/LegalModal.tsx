import React, { useEffect, useCallback } from 'react';
import styles from '../Header/LandingPageModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Legal Disclaimer</h2>
          <button className={styles.modalCloseButton} onClick={onClose} aria-label="Close Legal Modal">
            &times;
          </button>
        </div>

        <div className={styles.modalBody}>
          <section className={styles.modalSection}>
            <p>legal disclaimer language here</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
