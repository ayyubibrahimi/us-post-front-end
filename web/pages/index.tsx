import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAgencyDataByState } from '../utils/fetchData';
import LandingScreen from '../components/LandingPage/LandingScreen';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

export default function Home() {
  const [selectedState, setSelectedState] = useState('');
  const [agencyData, setAgencyData] = useState([]);
  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleStateSelection = async (state) => {
    setIsLoading(true);
    setError(null);
    setSelectedState(state);

    try {
      const stateData = await fetchAgencyDataByState(state);
      setAgencyData(stateData);
      setShowLandingScreen(false);
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
      setAgencyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (showLandingScreen) {
    return <LandingScreen onButtonClick={handleStateSelection} />;
  }

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <Header selectedState={selectedState} onStateChange={handleStateSelection} />
      <main className="flex-grow p-4">
        <div className="tableContainer">
          {isLoading ? (
            <p>Loading data for {selectedState}...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="tableWrapper">
              <AgencyTable agencyData={agencyData} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
