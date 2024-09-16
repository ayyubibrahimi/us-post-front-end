import React from 'react';
import styles from './LouisianaModal.module.scss';

interface LouisianaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LouisianaModal: React.FC<LouisianaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Louisiana</h2>
        <div className={styles.modalText}>
          <p>
            While Louisiana&apos;s Peace Officer Standards and Training Council (POST) has not released the state&apos;s police certification and employment history data, these data have begun to be collected on an individual basis by the Innocence Project New Orleans&apos; Louisiana Law Enforcement Accountability Database (LLEAD). You can access the data at <a href="https://llead.co/" target="_blank" rel="noopener noreferrer">llead.co.</a>
          </p>
          
          <br />
          
          <p>Further reading about the police certification system in Louisiana:</p>
          <ul>
            <li>
              • <a href="https://theappeal.org/louisiana-still-keeps-some-police-data-secret/" target="_blank" rel="noopener noreferrer">
                4/8/2024: Despite Reforms, Louisiana Still Keeps Some Police Data Secret
              </a> (The Appeal)
            </li>
            <li>
              • <a href="https://www.nola.com/news/crime_police/louisiana-refuses-to-ban-many-abusive-cops-despite-reforms/article_60e21fd2-c4fd-11ed-8a98-af00dd82e69f.html" target="_blank" rel="noopener noreferrer">
                4/21/2023: Louisiana rarely bans police convicted or fired for abuse: &apos;This has been a failure.&apos;
              </a> (NOLA.com)
            </li>
          </ul>
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default LouisianaModal;