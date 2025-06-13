import React, { useState } from "react";
import LandingPageAboutModal from "../Header/LandingPageAboutModal";
import styles from "./Footer.module.scss";

export default function Footer() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  return (
    <div className={styles.footer}>
      <div className={styles["nav-links-wrapper"]}>
        <button
          type="button"
          className={styles.links}
          onClick={handleAboutClick}
          aria-label="Open About Modal"
        >
          About
        </button>
        <LandingPageAboutModal
          isOpen={isAboutModalOpen}
          onClose={handleCloseAboutModal}
        />
        <a
          className={styles.links}
          href="https://invisible.institute/contact"
          aria-label="Contact us"
        >
          Contact
        </a>
        <a
          className={styles.links}
          href="https://github.com/ayyubibrahimi/us-post-data"
          aria-label="View our GitHub repository"
        >
          Github
        </a>
      </div>
      <div className={styles["logo-wrapper"]}>
        <a
          href="https://invisible.institute/national-police-index"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Invisibile Institute"
        >
          <img
            src="/img/invist-logo-black.png"
            alt="Invist Logo"
            width={110}
            height={20}
            className={styles.logo}
          />
        </a>
        <a
          href="https://ip-no.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit IPNO"
        >
          <img
            src="/img/ipno.jpg"
            alt="IPNO Logo"
            width={155}
            height={20}
            className={styles.logo}
          />
        </a>
        <a
          href="https://hrdag.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit HRDAG"
        >
          <img
            src="/img/hrdag.png"
            alt="HRDAG Logo"
            width={80}
            height={20}
            className={styles.logo}
          />
        </a>
        <a
          href="https://mljusticelab.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit ML Justivce Lab"
        >
          <img
            src="/img/ml-jlab.png"
            alt="ML Justice Lab Logo"
            width={80}
            height={20}
            className={styles.logo}
          />
        </a>
      </div>
    </div>
  );
}
