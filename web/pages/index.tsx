import React, { useState, useCallback, useEffect } from 'react';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAgencyDataByState } from '../utils/fetchData';
import LandingScreen from '../components/LandingPage/LandingScreen';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

const dataCache = new Map();

export default function Home() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [showLandingScreen, setShowLandingScreen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchStateData = useCallback(async () => {
    if (!selectedState || isLoading) return;

    const cacheKey = selectedState;
    
    if (dataCache.has(cacheKey)) {
      const cachedData = dataCache.get(cacheKey);
      setAgencyData(cachedData.data);
      setTotalCount(cachedData.totalCount);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, totalCount } = await fetchAgencyDataByState(selectedState);
      setAgencyData(data);
      setTotalCount(totalCount);
      setShowLandingScreen(false);
      
      dataCache.set(cacheKey, { data, totalCount });
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, isLoading]);

  useEffect(() => {
    if (selectedState) {
      fetchStateData();
    }
  }, [selectedState, fetchStateData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]);
    dataCache.clear();
  };

  if (showLandingScreen) {
    return <LandingScreen onButtonClick={handleStateSelection} />;
  }

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <Header selectedState={selectedState} onStateChange={handleStateSelection} />
      <main className="flex-grow p-4">
        <div className="tableContainer">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="tableWrapper">
              <AgencyTable 
                agencyData={agencyData}
                totalCount={totalCount}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}