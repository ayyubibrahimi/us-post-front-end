import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './headerLight.module.scss';
import AboutModal from './AboutModal';

// Utility functions for state name formatting
export const formatStateForUrl = (state: string): string => {
  return state.replace(/\s+/g, '-');
};

export const formatStateForDisplay = (state: string): string => {
  return state.replace(/-/g, ' ');
};

const states = [
  "Arizona", 'California', "Florida", "Florida Discipline",
  "Georgia", "Georgia Discipline", "Illinois", "Indiana",
  "Kansas", "Kentucky", "Maryland", "Minnesota",  "Mississippi",
  "New Mexico", "North Carolina", "Ohio", "Oregon", "South Carolina", 
  "Tennessee", "Texas", "Utah", "Washington", "Vermont",
   "West Virginia", "Wyoming"
];

interface HeaderProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedState, onStateChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert URL format to display format for the current selected state
  const displayState = formatStateForDisplay(selectedState);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStateSelection = (state: string) => {
    // Convert to URL format when passing to parent
    onStateChange(formatStateForUrl(state));
    setIsDropdownOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutModalOpen(true);
  };

  const handleCloseAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.navItems}>
          <Link href="/" className={styles.headerTitleLink}>
            <h1 className={styles.headerTitle}>
              National Police Index
            </h1>
          </Link>
          <div className={styles.dropdown} ref={dropdownRef}>
            <button className={styles.dropdownToggle} onClick={handleDropdownToggle}>
              {displayState || "Select a State"}
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenuWrapper}>
                <ul className={styles.dropdownMenu}>
                  {states.map((state) => (
                    <li 
                      key={state} 
                      className={`${styles.dropdownItem} ${state === displayState ? styles.active : ''}`} 
                      onClick={() => handleStateSelection(state)}
                    >
                      {state}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className={styles.aboutButton} onClick={handleAboutClick}>
            About{displayState ? ` ${displayState}` : ''}
          </button>
        </div>
      </div>
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={handleCloseAboutModal} 
        selectedState={displayState} 
      />
    </header>
  );
};

export default Header;