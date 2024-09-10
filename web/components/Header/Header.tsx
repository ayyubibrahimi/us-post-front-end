import React, { useState } from 'react';
import styles from './headerLight.module.scss';
import AboutModal from './AboutModal';

const states = [
  "Arizona", "California", "Illinois", "Tennessee", "Utah", "West Virginia",
];

interface HeaderProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedState, onStateChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStateSelection = (state: string) => {
    onStateChange(state);
    setIsDropdownOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.navItems}>
          <h1 className={styles.headerTitle}>
            Peace Officer Employment History Database
          </h1>
          <div className={styles.dropdown}>
            <button className={styles.dropdownToggle} onClick={handleDropdownToggle}>
              {selectedState || "Select a State"}
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {states.map((state) => (
                  <li 
                    key={state} 
                    className={`${styles.dropdownItem} ${state === selectedState ? styles.active : ''}`} 
                    onClick={() => handleStateSelection(state)}
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className={styles.aboutButton} onClick={handleAboutClick}>
            About
          </button>
        </div>
      </div>
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={handleCloseAboutModal} 
        selectedState={selectedState} 
      />
    </header>
  );
};

export default Header;