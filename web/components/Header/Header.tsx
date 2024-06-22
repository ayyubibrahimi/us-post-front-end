import React, { useState, useEffect } from 'react';
import styles from './headerLight.module.scss';
import { fetchUniqueAgencies } from '../../utils/api';

const Header = ({ changeState }) => {
  const [selectedState, setSelectedState] = useState('Georgia'); // Track selected state

  useEffect(() => {
    async function loadAgencies() {
      try {
        const data = await fetchUniqueAgencies(selectedState);
        // Assume setAgencies function or similar logic will be used here.
      } catch (error) {
        console.error("Failed to fetch agencies:", error);
      }
    }
    loadAgencies();
  }, [selectedState]); // Refetch when selectedState changes

  const handleStateChange = (state) => {
    changeState(state); // Notify the parent component
    setSelectedState(state); // Update local selected state
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.navItems}>
          <h1 className={styles.headerTitle}>
            {"Peace Officer Employment History Database"}
          </h1>
          <div className={styles.stateButtons}>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;