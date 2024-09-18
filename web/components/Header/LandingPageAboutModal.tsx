import React, { useState, useEffect, useCallback } from "react";
import styles from "./LandingPageModal.module.scss";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LandingPageModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("about");

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const linkStyle = {
    color: "blue",
    textDecoration: "underline",
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>National Police Index</h2>
          <button
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "about" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "team" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("team")}
          >
            Team
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === "about" && (
            <>
              <section className={styles.modalSection}>
                <p>
                  The National Police Index is a project and data tool showing
                  police employment history data obtained from state police
                  training and certification boards across the U.S. All but one
                  state has such a system.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The National Police Index is a public data project of
                  Invisible Institute, a nonprofit public accountability
                  journalism organization based in Chicago, created in
                  partnership with Ayyub Ibrahim of the Louisiana Law
                  Enforcement Accountability Database of Innocence Project New
                  Orleans, and Tarak Shah of the Human Rights Data Analysis
                  Group.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Access to this data helps show potential &quot;wandering
                  officers,&quot; and is intended for use by residents,
                  journalists, researchers, attorneys, and other stakeholders.
                  Information about the age, source, and other specifics for
                  each state is available on each page.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  In total, 27 states have released centralized employment
                  history data, 17 of which are currently represented on the
                  data tool. In addition, several states have released subsets
                  of this data in their own lookup tools: Illinois,
                  Massachusetts, Minnesota, Ohio, Oregon, and Texas.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The data tool was created by Ayyub Ibrahim with contributions
                  from Tarak Shah, Olive Lavine and Maheen Khan.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The data files were collected over the course of over two
                  years by a coalition of news and legal organizations. In
                  addition to Invisible Institute, these included reporters,
                  students, attorneys, and others with Big Local News at
                  Stanford, CBS News, Hearst Newspapers, California Reporting
                  Project, Howard Center for Investigative Journalism at the
                  University of Maryland, ABC Owned &amp; Operated Stations,
                  American Public Media Research Lab, WPLN, Utah Investigative
                  Journalism Project/Utah Freedom of Information Hotline,
                  University of North Carolina at Chapel Hill, Oregon Public
                  Broadcasting, Washington City Paper/George Washington
                  University Public Justice Advocacy Clinic, Tony Webster, and
                  Mirror Indy.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Efforts are being and were made to obtain data in states that
                  have made it inaccessible by Invisible Institute and Colorado
                  Springs Gazette/Reporters Committee for Freedom of the Press,
                  Detroit Metro Times/University of Michigan Civil Rights
                  Litigation Initiative, Delaware Call/ACLU of Delaware, Hearst
                  Newspapers, MuckRock/University of Virginia First Amendment
                  Clinic, The Badger Project/Wisconsin Transparency
                  Project/University of Illinois First Amendment Clinic,
                  Louisiana Law Enforcement Accountability Database/Innocence
                  Project New Orleans, AL.com, Arkansas Advocate, The Frontier,
                  SpotlightPA/Pennsylvania NewsMedia Association, and Sioux
                  Falls Argus Leader.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  A special thanks goes out to Huy Dao, Bailey Passamore, and
                  Eliora Henzler.
                </p>
              </section>
            </>
          )}

          {activeTab === "team" && (
            <>
              <h3>Core team</h3>
              <section className={styles.modalSection}>
                <p>
                  <strong>Sam Stecklow</strong> (he/him) is an investigative
                  journalist and FOIA fellow with Invisible Institute. He works
                  on Invisible Institute&apos;s Civic Police Data Project and
                  investigations.
                </p>
              </section>
              <section className={styles.modalSection}>
                <p>
                  <strong>Ayyub Ibrahim</strong> (he/him) serves as the Director of Research for the
                  Innocence Project New Orleans&apos; Louisiana Law Enforcement
                  Accountability Database{" "}
                  <a
                    href="https://llead.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    (LLEAD)
                  </a>{" "}
                  and is the founder of{" "}
                  <a
                    href="https://github.com/ayyubibrahimi/mljusticelab-tools"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    Machine Learning Justice Lab
                  </a>
                  . He previously worked for the Amman Center for Human Rights
                  Studies, the World Justice Project, and the Office of the
                  Independent Police Monitor (New Orleans).
                </p>
              </section>
              <section className={styles.modalSection}>
                <p>
                  <strong>Tarak Shah</strong> (he/they) is a data scientist at
                  the Human Rights Data Analysis Group. He works with community
                  organizations, lawyers, journalists, international human
                  rights institutions, and transitional justice mechanisms to
                  support campaigns for accountability through quantitative
                  analysis. He currently serves as program manager of the
                  Community Law Enforcement Network, an interdisciplinary effort
                  to collect and publish records related to police force and
                  misconduct in California.
                </p>
              </section>
              <section className={styles.modalSection}>
                <p>
                  <strong>Maheen Khan</strong> is Invisible Institute&apos;s
                  Director of Technology. She studied Information Analysis and
                  Computer Science at the University of Michigan. At the
                  Invisible Institute, she primarily works to maintain the Civic
                  Police Data Project, and to expand the police misconduct tool
                  to other cities.
                </p>
              </section>
              <section className={styles.modalSection}>
                <p>
                  <strong>Chaclyn Hunt</strong> is Invisible Institute&apos;s
                  legal director and a civil rights attorney.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageModal;
