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
      setAgencyData(data);  // Directly set the new page's data
      setTotalCount(total);
      setLoadedPages(prevPages => new Set(prevPages).add(page));
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, pageSize, isLoading]);

  useEffect(() => {
    if (selectedState && !showLandingScreen && !loadedPages.has(pageIndex)) {
      fetchPageData(pageIndex);
    }
  }, [selectedState, showLandingScreen, pageIndex, loadedPages, fetchPageData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]); // Clear agency data
    setPageIndex(0); // Reset page index
    setTotalCount(0); 
    setLoadedPages(new Set()); // Clear loaded pages
    setShowLandingScreen(false);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex); // No need to explicitly call fetchPageData
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0);
    setLoadedPages(new Set()); // Reset loaded pages when changing page size
    setAgencyData([]); // Clear agency data for fresh fetch
    fetchPageData(0); // Fetch for the first page with the new page size
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
                agencyData={agencyData}  // Use the current page's data
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
