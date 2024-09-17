import Image from "next/image";
import React, { useState } from "react";
import styles from "./Footer.module.scss";
import LegalModal from "../LegalModal/LegalModal";
import LandingPageAboutModal from "../Header/LandingPageAboutModal";

export default function Footer() {
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleLegalClick = () => {
    setIsLegalModalOpen(true);
  };

  const handleCloseLegalModal = () => {
    setIsLegalModalOpen(false);
  };

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
          className={styles["links"]}
          onClick={handleAboutClick}
          aria-label="Open About Modal"
        >
          About
        </button>
        <LandingPageAboutModal
          isOpen={isAboutModalOpen}
          onClose={handleCloseAboutModal}
        />
        <button
          className={styles["links"]}
          onClick={handleLegalClick}
          aria-label="Open Legal Modal"
        >
          Legal
        </button>
        <LegalModal isOpen={isLegalModalOpen} onClose={handleCloseLegalModal} />
        <a
          className={styles["links"]}
          href="https://invisible.institute/contact"
          aria-label="Contact us"
        >
          Contact
        </a>
        <a
          className={styles["links"]}
          href="https://github.com/ayyubibrahimi/us-post-front-end"
          aria-label="View our GitHub repository"
        >
          Github
        </a>
      </div>
      <div className={styles["logo-wrapper"]}>
        <a
          href="https://ip-no.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit IPNO"
        >
          <Image
            src="/img/ipno.jpg"
            alt="IPNO Logo"
            width={155}
            height={20}
            className={styles["logo"]}
          />
        </a>
        <a
          href="https://invisible.institute/police-data"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Invisibile Institute"
        >
          <Image
            src="/img/invist-logo-black.png"
            alt="Invist Logo"
            width={110}
            height={20}
            className={styles["logo"]}
          />
        </a>
      </div>
    </div>
  );
}
