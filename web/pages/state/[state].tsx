import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import AgencyTable from '../../components/Pages/AgencyTable';
import Header from '../../components/Header/Header';
import styles from '../index.module.scss';

interface AgencyData {
  case_id?: string;
  person_nbr: string;
  sanction?: string;
  sanction_date?: string;
  violation?: string;
  violation_date?: string;
  agency_name: string;
  employment_status?: string;
  employment_change?: string;
  start_date: string;
  end_date: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  suffix?: string;
  year_of_birth?: string;
  race?: string;
  sex?: string;
  separation_reason?: string;
}

interface Filters {
  lastName: string;
  firstName: string;
  agencyName: string;
  uid: string;
}

const StatePage: React.FC = () => {
  const router = useRouter();
  const { state } = router.query;

  const [agencyData, setAgencyData] = useState<AgencyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({
    lastName: '',
    firstName: '',
    agencyName: '',
    uid: ''
  });

  const fetchStateData = useCallback(async (page: number, size: number, currentFilters: Filters) => {
    if (!state || typeof state !== 'string') return;

    setIsLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      state: state,
      page: page.toString(),
      pageSize: size.toString(),
      ...Object.fromEntries(Object.entries(currentFilters).filter(([_, v]) => v !== ''))
    });

    try {
      const response = await fetch(`../api/fetchStateData?${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch state data');
      }
      const { data, currentPage, pageSize, hasNextPage } = await response.json();
      
      setAgencyData(data);
      setCurrentPage(currentPage);
      setPageSize(pageSize);
      setHasNextPage(hasNextPage);
    } catch (error) {
      console.error("Error fetching state data:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  useEffect(() => {
    if (state && typeof state === 'string') {
      fetchStateData(currentPage, pageSize, filters);
    }
  }, [state, currentPage, pageSize, filters, fetchStateData]);

  const handleStateSelection = (newState: string) => {
    router.push(`/state/${encodeURIComponent(newState)}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchStateData(1, pageSize, newFilters);
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!state || typeof state !== 'string') {
    return <div>Invalid state</div>;
  }

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <Header selectedState={state} onStateChange={handleStateSelection} />
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">{state} Peace Officer Employment History</h1>
        <AgencyTable
          agencyData={agencyData}
          isLoading={isLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
      </main>
    </div>
  );
};

export default StatePage;