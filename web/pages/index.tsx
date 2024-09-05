import React, { useState, useCallback, useEffect } from 'react';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAgencyDataByState } from '../utils/fetchData';
import LandingScreen from '../components/LandingPage/LandingScreen';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

export default function Home() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [agencyData, setAgencyData] = useState<any[]>([]);
  const [showLandingScreen, setShowLandingScreen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchStateData = useCallback(async () => {
    if (!selectedState || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, totalCount } = await fetchAgencyDataByState(
        selectedState,
        { pageIndex, pageSize },
        (progressData, progressTotalCount) => {
          setAgencyData(progressData);
          setTotalCount(progressTotalCount);
        }
      );
      setAgencyData(data);
      setTotalCount(totalCount);
      setShowLandingScreen(false);
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, pageIndex, pageSize, isLoading]);

  useEffect(() => {
    if (selectedState) {
      fetchStateData();
    }
  }, [selectedState, pageIndex, pageSize, fetchStateData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]);
    setPageIndex(0);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0);
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
                pageIndex={pageIndex}
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