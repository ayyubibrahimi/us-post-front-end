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
  case_opened_date?: string;
  case_closed_date?: string;
  offense?: string;
  discipline_imposed?: string;
  discipline_comments?: string;
}

interface Filters {
  lastName: string;
  firstName: string;
  agencyName: string;
  uid: string;
  startDate: string;
  endDate: string;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isLastPage: boolean;  // Add this line
}

const StatePage: React.FC = () => {
  const router = useRouter();
  const { state } = router.query;

  const [agencyData, setAgencyData] = useState<AgencyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 100,
    totalItems: 0,
    totalPages: 1,
    isLastPage: false  // Add this line
  });
  const [filters, setFilters] = useState<Filters>({
    lastName: '',
    firstName: '',
    agencyName: '',
    uid: '',
    startDate: '',
    endDate: ''
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
      const { data, currentPage, pageSize, totalItems, totalPages, isLastPage } = await response.json();
      
      setAgencyData(data);
      setPaginationInfo({
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        isLastPage
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const fetchEntireCSV = useCallback(async () => {
    if (!state || typeof state !== 'string') return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`../api/downloadStateCSV?state=${encodeURIComponent(state)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch CSV download URL');
      }
      const { downloadUrl } = await response.json();
      return downloadUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [state]);
  
  useEffect(() => {
    if (state && typeof state === 'string' && !paginationInfo.isLastPage) {
      fetchStateData(paginationInfo.currentPage, paginationInfo.pageSize, filters);
    }
  }, [state, paginationInfo.currentPage, paginationInfo.pageSize, filters, fetchStateData, paginationInfo.isLastPage]);

  const handleStateSelection = (newState: string) => {
    router.push(`/state/${encodeURIComponent(newState)}`);
  };

  const handlePageChange = (page: number) => {
    if (page <= paginationInfo.totalPages) {
      setPaginationInfo(prev => ({ ...prev, currentPage: page }));
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPaginationInfo(prev => ({ ...prev, pageSize: size, currentPage: 1, isLastPage: false }));
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    
    // Check if all filters are empty
    const areAllFiltersEmpty = Object.values(newFilters).every(value => value === '');
    
    setPaginationInfo(prev => ({
      ...prev,
      currentPage: 1,
      isLastPage: false,
      // Reset pageSize to 100 if all filters are empty, otherwise keep the current pageSize
      pageSize: areAllFiltersEmpty ? 100 : prev.pageSize
    }));
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
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
          filters={filters}
          fetchEntireCSV={fetchEntireCSV}
        />
      </main>
    </div>
  );
};

export default StatePage;