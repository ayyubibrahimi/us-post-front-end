import React, { useEffect, useState, useRef } from 'react';
import { fetchUniqueAgencies } from '../../utils/api';
import AgencyCard from './AgencyCard';
// Remove Link import if it's not used elsewhere
import { HoverProvider } from './HoverContext'; // Adjust the import path as necessary
import styles from './agencyBox.module.scss';

const AgencyBox = ({ selectedState }) => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUniqueAgencies(selectedState);
        setAgencies(data);
        setLoading(false);
      } catch (error) {
        setError(error.toString());
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedState]);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.agencyBoxContainer}>
      <h2 className={styles.header}>Agencies in {selectedState}</h2>
      <HoverProvider> {/* Wrap the rendering of AgencyCards with HoverProvider */}
        <div className={styles.agencyGrid} ref={scrollContainerRef}>
          {agencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} />
          ))}
        </div>
      </HoverProvider>
      <div className={styles.navigationButtons}>
        <button className={styles.button} onClick={() => scroll(-300)}>{"<"}</button>
        <button className={styles.button} onClick={() => scroll(300)}>{">"}</button>
      </div>
    </div>
  );
};

export default AgencyBox;
