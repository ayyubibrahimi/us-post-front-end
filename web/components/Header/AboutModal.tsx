import React from 'react';
import styles from './AboutModal.module.scss';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, selectedState }) => {
  if (!isOpen) return null;

  const stateInfo: { [key: string]: React.ReactNode } = {
    "Arizona": (
      <>
        <p>Data about law enforcement officers in Arizona were obtained under the Arizona Public Records Law from the Arizona Peace Officer Standards and Training Board. The data released includes personnel and employment history for all officers certified in the state, with data going back to the 1950s. The data were processed by John Kelly of CBS News. [*need response letter here*] [*link to readme*]</p>
        
        <br />
        
        <p>The data include police and correctional officers. They do not include information on federal law enforcement officers.</p>
        
        <br />
        
        <h3>Further reading</h3>
        <ul>
          <li>
            • <a href="https://azcir.org/news/2024/05/23/border-vigilantes-blur-lines-between-law-enforcement/" target="_blank" rel="noopener noreferrer">5/23/24: Border vigilantes blur the lines of law enforcement</a> (Arizona Center for Investigative Reporting/Texas Observer)
          </li>
          <li>
            • <a href="https://www.abc15.com/news/local-news/investigations/inside-an-arizona-police-department-filled-with-brady-list-cops" target="_blank" rel="noopener noreferrer">8/7/20: Inside an Arizona police department filled with Brady list cops</a> (ABC 15)
          </li>
          <li>
            • <a href="https://www.abc15.com/news/local-news/investigations/full-disclosure-arizona-fails-to-properly-track-problematic-brady-list-cops" target="_blank" rel="noopener noreferrer">8/6/20: Full Disclosure: Arizona fails to properly track problematic &apos;Brady list&apos; cops</a> (ABC 15)
          </li>
          <li>
            • <a href="https://www.phoenixnewtimes.com/news/globe-arizona-police-misconduct-reform-chief-walters-folker-keeling-11406450" target="_blank" rel="noopener noreferrer">12/13/19: For a Tiny Police Department, Globe, Arizona, Has Big Problems</a> (Phoenix New Times)
          </li>
          <li>
            • <a href="https://www.azcentral.com/story/news/local/arizona/2019/04/25/accused-misconduct-one-department-law-enforcement-officers-move-next-one/3541385002/" target="_blank" rel="noopener noreferrer">4/25/19: Accused of misconduct in one department, law-enforcement officers move on to the next one</a> (The Arizona Republic)
          </li>
        </ul>
      </>
    ),
    "California": "California maintains a detailed database of peace officer employment history, promoting accountability in the state's law enforcement.",
    "Florida": "Florida's peace officer employment history database offers insights into the careers of law enforcement professionals across the state.",
    "Georgia": "Georgia's database tracks the employment history of peace officers, supporting informed decision-making in law enforcement hiring.",
    "Illinois": "Illinois maintains a thorough database of peace officer employment records, fostering trust between communities and law enforcement.",
    "Maryland": "Maryland's peace officer employment history database serves as a valuable resource for tracking law enforcement careers in the state.",
    "Ohio": "Ohio's database provides a comprehensive view of peace officer employment history, enhancing accountability in law enforcement.",
    "Oregon": "Oregon's peace officer employment history database offers transparency in law enforcement career tracking across the state.",
    "South Carolina": "South Carolina maintains a detailed database of peace officer employment records, supporting informed hiring decisions in law enforcement.",
    "Tennessee": "Tennessee's database offers insights into the employment history of peace officers, promoting transparency in law enforcement.",
    "Texas": "Texas maintains a comprehensive database of peace officer employment history, supporting accountability in its large law enforcement community.",
    "Vermont": "Vermont's peace officer employment history database provides transparency in law enforcement career tracking for the state.",
    "Washington": "Washington's database offers detailed peace officer employment records, enhancing accountability in the state's law enforcement agencies."
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>About {selectedState} Peace Officer Employment History Database</h2>
        <div className={styles.modalText}>
          {stateInfo[selectedState] || "Information about this state's peace officer employment history database is currently unavailable."}
        </div>
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AboutModal;