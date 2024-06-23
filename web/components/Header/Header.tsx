import React from 'react';
import styles from './headerLight.module.scss';

const Header = ({ selectedState, onStateChange }) => {
  const states = [
    "Washington", "Virginia", "Texas", "Tennessee", "South Carolina",
    "Oregon", "Ohio", "Maryland", "Illinois", "Georgia", "Florida",
    "California", "Arizona"
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.navItems}>
          <h1 className={styles.headerTitle}>
            Peace Officer Employment History Database
          </h1>
          <div className={styles.stateSelector}>
            <label htmlFor="stateSelect">Current State: </label>
            <select
              id="stateSelect"
              value={selectedState}
              onChange={(e) => onStateChange(e.target.value)}
              className={styles.stateSelect}
            >
              <option value="">Select a State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;