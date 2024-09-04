import React, { useState, useEffect, useCallback } from 'react';
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
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

  const fetchPageData = useCallback(async (page: number) => {
    if (!selectedState || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, totalCount: total } = await fetchAgencyDataByState(selectedState, page * pageSize, pageSize);
      setAgencyData(prevData => {
        const newData = [...prevData];
        newData.splice(page * pageSize, pageSize, ...data);
        return newData;
      });
      setTotalCount(total);
      setLoadedPages(prevPages => new Set(prevPages).add(page));
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, pageSize]);

  useEffect(() => {
    if (selectedState && !showLandingScreen && !loadedPages.has(pageIndex)) {
      fetchPageData(pageIndex);
    }
  }, [selectedState, showLandingScreen, pageIndex, loadedPages, fetchPageData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]);
    setPageIndex(0);
    setTotalCount(0);
    setLoadedPages(new Set());
    setShowLandingScreen(false);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
    fetchPageData(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
  setPageSize(newPageSize);
  setPageIndex(0);
  setLoadedPages(new Set());
  setAgencyData([]);
  fetchPageData(0);
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
                agencyData={agencyData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)}
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