import { useRouter } from "next/router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import AgencyTable from "../../components/Table/AgencyTable";
import SearchModal from "../../components/Table/SearchModal";
import styles from "../index.module.scss";

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
  middleName: string;
  uid: string;
  startDate: string;
  endDate: string;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  isLastPage: boolean;
}

const initialFilters: Filters = {
  lastName: "",
  middleName: "",
  firstName: "",
  agencyName: "",
  uid: "",
  startDate: "",
  endDate: "",
};

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
    isLastPage: false,
  });
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchStateData = useCallback(
    async (page: number, size: number, currentFilters: Filters) => {
      if (!state || typeof state !== "string") return;

      setIsLoading(true);
      setError(null);

      const cleanFilters = Object.fromEntries(
        Object.entries(currentFilters).filter(
          ([key, value]) => value !== "" && key !== "columnFilters",
        ),
      );

      const queryParams = new URLSearchParams({
        state,
        page: page.toString(),
        pageSize: size.toString(),
        ...cleanFilters,
      });

      try {
        const response = await fetch(`../api/fetchStateData?${queryParams}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to fetch state data");
        }
        const {
          data,
          currentPage,
          pageSize,
          totalItems,
          totalPages,
          isLastPage,
        } = await response.json();

        setAgencyData(data);
        setPaginationInfo({
          currentPage,
          pageSize,
          totalItems,
          totalPages,
          isLastPage,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [state],
  );

  const fetchEntireCSV = useCallback(async () => {
    if (!state || typeof state !== "string") return null;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `../api/downloadStateCSV?state=${encodeURIComponent(state)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch CSV download URL");
      }
      const { downloadUrl } = await response.json();
      return downloadUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  // Initial fetch on mount / when `state` changes
  useEffect(() => {
    if (state && typeof state === "string") {
      fetchStateData(1, paginationInfo.pageSize, filters);
    }
  }, [state, fetchStateData, paginationInfo.pageSize, filters]);

  // Explicit search handler (invoked by modal)
  const handleSearch = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      setPaginationInfo((p) => ({ ...p, currentPage: 1 }));
      if (state && typeof state === "string") {
        fetchStateData(1, paginationInfo.pageSize, newFilters);
      }
    },
    [state, paginationInfo.pageSize, fetchStateData],
  );

  const handleStateSelection = (newState: string) => {
    router.push(`/state/${encodeURIComponent(newState)}`);
  };

  // Reset handler: clear all filters, reset pagination, reload original data
  const handleReset = () => {
    setFilters(initialFilters);
    setPaginationInfo((p) => ({ ...p, currentPage: 1 }));
    if (state && typeof state === "string") {
      fetchStateData(1, paginationInfo.pageSize, initialFilters);
    }
    setIsSearchOpen(false);
  };

  // Pagination callbacks
  const handlePageChange = (page: number) => {
    if (page <= paginationInfo.totalPages) {
      setPaginationInfo((p) => ({ ...p, currentPage: page }));
      if (state && typeof state === "string") {
        fetchStateData(page, paginationInfo.pageSize, filters);
      }
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPaginationInfo((p) => ({ ...p, pageSize: size, currentPage: 1 }));
    if (state && typeof state === "string") {
      fetchStateData(1, size, filters);
    }
  };

  if (router.isFallback) return <div>Loading...</div>;
  if (!state || typeof state !== "string") return <div>Invalid state</div>;

  return (
    <div className={`${styles.pageContainer} flex flex-col h-screen`}>
      <Header
        selectedState={state}
        onStateChange={(s) => router.push(`/state/${encodeURIComponent(s)}`)}
      />

      <main className="flex-grow p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className={styles.pageTitle}>
            {state} Officer Employment History Data
          </h1>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Search
          </button>
        </div>

        <SearchModal
          open={isSearchOpen}
          initialFilters={filters}
          onClose={() => setIsSearchOpen(false)}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <AgencyTable
          agencyData={agencyData}
          isLoading={isLoading}
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          fetchEntireCSV={fetchEntireCSV}
        />

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}
      </main>
    </div>
  );
};

export default StatePage;
