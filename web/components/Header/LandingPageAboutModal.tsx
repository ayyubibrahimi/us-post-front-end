import React, { useState, useEffect, useCallback } from 'react';
import styles from './LandingPageModal.module.scss';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LandingPageModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('about');

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

  const linkStyle = {
    color: 'blue',
    textDecoration: 'underline',
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>National Police Index</h2>
          <button className={styles.modalCloseButton} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'about' ? styles.active : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'team' ? styles.active : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Team
          </button>
        </div>

        <div className={styles.modalBody}>
          {activeTab === 'about' && (
            <>
              <section className={styles.modalSection}>
                <p>
                  The National Police Index is a project and data tool showing police employment history data obtained
                  from state police training and certification boards across the U.S. All but one state has such a
                  system.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The National Police Index is a public data project led by reporter Sam Stecklow of Invisible
                  Institute, a nonprofit public accountability journalism organization based in Chicago, created in
                  partnership with Ayyub Ibrahim of the Berkeley Institute for Data Science, and Tarak Shah of the Human
                  Rights Data Analysis Group.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Access to this data helps show potential &quot;wandering officers,&quot; and is intended for use by
                  residents, journalists, researchers, attorneys, and other stakeholders. Information about the age,
                  source, and other specifics for each state is available on each page.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Each state&apos;s database is closed to the others; names are common, and an officer&apos;s name
                  appearing in two states does not necessarily mean they are the same person. Specific records should be
                  sought from state training boards and individual police departments to confirm the identity of an
                  individual whose name appears in multiple states.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  In total, 27 states have released centralized employment history data, 23 of which are currently
                  represented on the data tool.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The data tool was created by Ayyub Ibrahim with contributions from Tarak Shah, Olive Lavine and Maheen
                  Khan.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  The data files were collected over the course of over two years by a coalition of news and legal
                  organizations. In addition to Invisible Institute, these included reporters, students, attorneys, and
                  others with Big Local News at Stanford, CBS News, Hearst Newspapers, California Reporting Project,
                  Howard Center for Investigative Journalism at the University of Maryland, ABC Owned &amp; Operated
                  Stations, American Public Media Research Lab, WPLN, Utah Investigative Journalism Project/Utah Freedom
                  of Information Hotline, University of North Carolina at Chapel Hill, Oregon Public Broadcasting,
                  Washington City Paper/George Washington University Public Justice Advocacy Clinic, Tony Webster,
                  WyoFile, Dragline/ACLU of West Virginia, and Mirror Indy.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Efforts are being and were made to obtain data in states that have made it inaccessible by Invisible
                  Institute and Colorado Springs Gazette/Reporters Committee for Freedom of the Press, Detroit Metro
                  Times/University of Michigan Civil Rights Litigation Initiative, Delaware Call/ACLU of Delaware,
                  Hearst Newspapers, MuckRock/University of Virginia First Amendment Clinic, The Badger
                  Project/Wisconsin Transparency Project/University of Illinois First Amendment Clinic, Louisiana Law
                  Enforcement Accountability Database/Innocence Project New Orleans, AL.com, Arkansas Advocate, The
                  Frontier, SpotlightPA/Pennsylvania NewsMedia Association, and Sioux Falls Argus Leader.
                </p>
              </section>

              <section className={styles.modalSection}>
                <p>
                  Access the underlying data files for the National Police Index at this{' '}
                  <a
                    href="https://www.dropbox.com/scl/fo/qfzs3pias4v65fp34cdal/AE_taG3_K2QxaGOG1CGsrzU?rlkey=6n2he8t6i95cde1n51kn1l1v5&st=r7cct5rp&dl=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    link.
                  </a>
                </p>
              </section>
            </>
          )}

          {activeTab === 'team' && (
            <div className={styles.teamContainer}>
              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  <a href="https://invisible.institute/sam-stecklow" target="_blank" rel="noopener noreferrer">
                    Sam Stecklow
                  </a>
                  <span className={styles.pronouns}>(he/him)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  An investigative journalist and FOIA fellow with{' '}
                  <a href="https://invisible.institute/introduction" target="_blank" rel="noopener noreferrer">
                    Invisible Institute
                  </a>
                  . He works on Invisible Institute&apos;s{' '}
                  <a href="https://invisible.institute/police-data" target="_blank" rel="noopener noreferrer">
                    Civic Police Data Project
                  </a>{' '}
                  and investigations.
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  Ayyub Ibrahim
                  <span className={styles.pronouns}>(he/him)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  A programmer at the{' '}
                  <a href="https://bids.berkeley.edu/home" target="_blank" rel="noopener noreferrer">
                    Berkeley Institute for Data Science (BIDS)
                  </a>
                  . He previously served as the Director of Research for the Innocence Project New Orleans&apos;
                  Louisiana Law Enforcement Accountability Database{' '}
                  <a href="https://llead.co" target="_blank" rel="noopener noreferrer">
                    (LLEAD)
                  </a>{' '}
                  and is the founder of{' '}
                  <a href="https://mljusticelab.com/" target="_blank" rel="noopener noreferrer">
                    Machine Learning Justice Lab
                  </a>
                  .
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  Tarak Shah
                  <span className={styles.pronouns}>(he/they)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  A data scientist at the Human Rights Data Analysis Group. He works with community organizations,
                  lawyers, journalists, international human rights institutions, and transitional justice mechanisms to
                  support campaigns for accountability through quantitative analysis. He currently serves as program
                  manager of the Community Law Enforcement Network, an interdisciplinary effort to collect and publish
                  records related to police force and misconduct in California.
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  Bailey Passmore
                  <span className={styles.pronouns}>(they/them)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  Has been working as a Data Scientist at the Human Rights Data Analysis Group since 2022.
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  <a href="https://invisible.institute/maheen-khan" target="_blank" rel="noopener noreferrer">
                    Maheen Khan
                  </a>
                  <span className={styles.pronouns}>(she/her)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  Invisible Institute&apos;s Director of Technology. She studied Information Analysis and Computer
                  Science at the University of Michigan. At Invisible Institute, she primarily works to maintain the
                  Civic Police Data Project, and to expand the police misconduct tool to other cities.
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  <a href="https://invisible.institute/chaclyn" target="_blank" rel="noopener noreferrer">
                    Chaclyn Hunt
                  </a>
                  <span className={styles.pronouns}>(she/her)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  Invisible Institute&apos;s legal director and a civil rights attorney.
                </p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  <a href="https://invisible.institute/maira-khwaja" target="_blank" rel="noopener noreferrer">
                    Maira Khwaja
                  </a>
                  <span className={styles.pronouns}>(she/her)</span>
                </h3>
                <p className={styles.teamMemberBio}>Invisible Institute&apos;s director of public strategy.</p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  Kaitlynn Cassady
                  <span className={styles.pronouns}>(she/her)</span>
                </h3>
                <p className={styles.teamMemberBio}>The communications manager at Invisible Institute.</p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>Lisa Pickoff-White</h3>
                <p className={styles.teamMemberBio}>California Reporting Project</p>
              </section>

              <section className={styles.teamMember}>
                <h3 className={styles.teamMemberName}>
                  <a href="https://github.com/michplunkett" target="_blank" rel="noopener noreferrer">
                    Michael Plunkett
                  </a>
                  <span className={styles.pronouns}>(he/him)</span>
                </h3>
                <p className={styles.teamMemberBio}>
                  A volunteer software developer who appreciates open data, quality journalism, and creating software
                  tools for journalists. He holds degrees in microbiology, computational biology, and computational
                  analysis and public policy. He also actively contributes to Lucy Parsons Labs'{' '}
                  <a href="https://openoversight.com/" target="_blank" rel="noopener noreferrer">
                    OpenOversight platform
                  </a>{' '}
                  and Bellingcat's{' '}
                  <a href="https://github.com/bellingcat/auto-archiver-api" target="_blank" rel="noopener noreferrer">
                    Auto Archiver API.
                  </a>
                </p>
              </section>

              <section className={`${styles.teamMember} ${styles.specialThanks}`}>
                <h3 className={styles.teamMemberName}>Special Thanks</h3>
                <p className={styles.teamMemberBio}>A special thanks goes out to Huy Dao and Eliora Henzler.</p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPageModal;
