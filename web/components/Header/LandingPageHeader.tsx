import Link from "next/link";
import type React from "react";
import styles from "./LandingPageHeader.module.scss";

const LandingPageHeader: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.headerTitleLink}>
          <h1 className={styles.headerTitle}>National Police Index</h1>
        </Link>

        <Link href="/info/about" className={styles.aboutButton}>
          About the NPI
        </Link>
      </div>
    </header>
  );
};

export default LandingPageHeader;
