import React, { useState, useEffect, useCallback } from 'react';
import AgencyTable from '../components/Pages/AgencyTable';
import { fetchAgencyDataByState } from '../utils/fetchData';
import LandingScreen from '../components/LandingPage/LandingScreen';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

export default function Home() {
  const [selectedState, setSelectedState] = useState<string>('');
  const [agencyData, setAgencyData] = useState<any[]>([]); // Accumulated data
  const [showLandingScreen, setShowLandingScreen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true); // To track if more data is available

  // Fetch the initial page and progressively load more in the background
  const fetchPageData = useCallback(async (page: number, append: boolean = false) => {
    if (!selectedState || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Progressive loading via callback
      await fetchAgencyDataByState(selectedState, page * pageSize, pageSize, (newData: any[]) => {
        setAgencyData(prevData => append ? [...prevData, ...newData] : newData); // Append or replace data
      }).then((completeData: any[]) => {
        setAgencyData(completeData);
        setHasMoreData(completeData.length < totalCount); // Check if there is more data to fetch
      });
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedState, pageSize, isLoading]);

  useEffect(() => {
    if (selectedState && !showLandingScreen && !isLoading) {
      fetchPageData(pageIndex, true); // Fetch next page in the background and append to data
    }
  }, [selectedState, showLandingScreen, pageIndex, fetchPageData]);

  const handleStateSelection = (state: string) => {
    setSelectedState(state);
    setAgencyData([]); // Clear agency data
    setPageIndex(0); // Reset page index
    setTotalCount(0);
    setShowLandingScreen(false);
    setHasMoreData(true); // Reset hasMoreData
    fetchPageData(0, false); // Fetch the first page
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0);
    setAgencyData([]); // Clear agency data for fresh fetch
    fetchPageData(0, false); // Fetch for the first page with the new page size
  };

  const handleLoadMore = () => {
    if (hasMoreData) {
      fetchPageData(pageIndex + 1, true); // Fetch the next page and append the data
      setPageIndex(pageIndex + 1); // Increment the page index
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
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="tableWrapper">
              <AgencyTable 
                agencyData={agencyData}  // Use the progressively fetched data
                totalCount={totalCount}
                isLoading={isLoading}
                pageIndex={pageIndex}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
              {hasMoreData && !isLoading && (
                <button className="mt-4" onClick={handleLoadMore}>
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
