import Link from "next/link";
import type React from "react";
import { useState } from "react";
import LandingPageAboutModal from "./LandingPageAboutModal";
import styles from "./LandingPageHeader.module.scss";

const LandingPageHeader: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.headerTitleLink}>
          <h1 className={styles.headerTitle}>National Police Index</h1>
        </Link>
        <button
          type="button"
          className={styles.aboutButton}
          onClick={handleAboutClick}
        >
          About the NPI
        </button>
      </div>
      <LandingPageAboutModal
        isOpen={isAboutModalOpen}
        onClose={handleCloseAboutModal}
      />
    </header>
  );
};

export default LandingPageHeader;
