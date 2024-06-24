import React, { useState } from 'react';
import styles from './headerLight.module.scss';

const states = [
  "Arizona", "California", "Florida", "Georgia", "Illinois", "Maryland",
  "Ohio", "Oregon", "South Carolina", "Tennessee", "Texas", "Vermont",
  "Washington"
];

interface HeaderProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedState, onStateChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleStateSelection = (state: string) => {
    onStateChange(state);
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.navItems}>
          <h1 className={styles.headerTitle}>
            {"Peace Officer Employment History Database"}
          </h1>
          <div className={styles.dropdown}>
            <button className={styles.dropdownToggle} onClick={handleDropdownToggle}>
              {selectedState || "Select a State"}
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {states.map((state) => (
                  <li key={state} className={styles.dropdownItem} onClick={() => handleStateSelection(state)}>
                    {state}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
