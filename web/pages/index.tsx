import React, { useState, useCallback, useEffect } from 'react';
import AgencyTable from '../components/Pages/AgencyTable';
import LandingScreen from '../components/LandingPage/LandingScreen';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

export default function Home() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [showLandingScreen, setShowLandingScreen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchStateData = useCallback(async (page: number, size: number) => {
    if (!selectedState || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/fetchStateData?state=${selectedState}&page=${page}&pageSize=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch state data');
      }
      const { data, totalCount } = await response.json();
      setAgencyData(data);
      setTotalCount(totalCount);
      setShowLandingScreen(false);
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, isLoading]);

  useEffect(() => {
    if (selectedState) {
      fetchStateData(currentPage, pageSize);
    }
  }, [selectedState, currentPage, pageSize, fetchStateData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
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
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}