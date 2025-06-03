import type React from "react";
import styles from "./LouisianaModal.module.scss";

interface LouisianaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
};

const LouisianaModal: React.FC<LouisianaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Louisiana</h2>
        <div className={styles.modalText}>
          <p>
            While Louisiana&apos;s Peace Officer Standards and Training Council
            (POST) has not released the state&apos;s police certification and
            employment history data, these data have begun to be collected on an
            individual basis by the Innocence Project New Orleans&apos;
            Louisiana Law Enforcement Accountability Database (LLEAD). You can
            access the data at{" "}
            <a
              href="https://llead.co/"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              llead.co.
            </a>
          </p>

          <br />

          <p>
            Read more about issues with access to Louisiana&apos;s employment
            history data{" "}
            <a
              href="https://theappeal.org/louisiana-still-keeps-some-police-data-secret/"
              style={linkStyle}
              target="_blank"
              rel="noopener noreferrer"
            >
              here.
            </a>
          </p>
        </div>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LouisianaModal;
