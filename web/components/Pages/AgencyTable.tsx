import React, { useState, useCallback, useMemo } from 'react';
import tableStyles from './table.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, Column, UseSortByColumnProps, HeaderGroup } from 'react-table';
import { debounce } from 'lodash';

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
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface AgencyTableProps {
  agencyData: AgencyData[];
  isLoading: boolean;
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
  fetchEntireCSV: () => Promise<string | null>;
}


const AgencyTable: React.FC<AgencyTableProps> = ({
  agencyData,
  isLoading,
  paginationInfo,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  filters,
  fetchEntireCSV,
}) => {
  // State for downloading entire CSV
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [csvDownloadUrl, setCSVDownloadUrl] = useState<string | null>(null);
  
  // Local state for input values
  const [localInputs, setLocalInputs] = useState(filters);

  const debouncedFilterChange = useMemo(
    () => debounce((newFilters: Filters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    // Update local input state immediately
    setLocalInputs(prev => ({ ...prev, [key]: value }));
    
    // Debounce the actual filter change
    debouncedFilterChange({ ...localInputs, [key]: value });
  }, [debouncedFilterChange, localInputs]);

  const hasNonEmptyColumn = useCallback((columnName: keyof AgencyData) => {
    return agencyData.some(row => row[columnName] && row[columnName]!.trim() !== '');
  }, [agencyData]);

  const columns = useMemo<Column<AgencyData>[]>(
    () => {
      const baseColumns: Column<AgencyData>[] = 
      
      [
        { Header: 'UID', accessor: 'person_nbr' },
      ];

      baseColumns.push({ Header: 'First Name', accessor: 'first_name' });
      
      if (hasNonEmptyColumn('middle_name')) {
        baseColumns.push({ Header: 'Middle Name', accessor: 'middle_name' });
      }

      baseColumns.push({ Header: 'Last Name', accessor: 'last_name' });
      
      if (hasNonEmptyColumn('suffix')) {
        baseColumns.push({ Header: 'Suffix', accessor: 'suffix' });
      }
      
      baseColumns.push(
        { Header: 'Start Date', accessor: 'start_date' },
        { Header: 'End Date', accessor: 'end_date' },
        { Header: 'Agency Name', accessor: 'agency_name' },
      );

      if (hasNonEmptyColumn('separation_reason')) {
        baseColumns.push({ Header: 'Separation Reason', accessor: 'separation_reason' });
      }

      // Add other conditional columns
      const conditionalColumns: [string, keyof AgencyData][] = [
        ['Status', 'employment_status'],
        ['Employment Change', 'employment_change'],
        ['Birth Year', 'year_of_birth'],
        ['Race', 'race'],
        ['Sex', 'sex'],
        ['Case ID', 'case_id'],
        ['Violation', 'violation'],
        ['Violation Date', 'violation_date'],
        ['Sanction', 'sanction'],
        ['Sanction Date', 'sanction_date'],
        ['Case Open Date', 'case_opened_date'],
        ['Case Close Date', 'case_closed_date'],
        ['Offense', 'offense'],
        ['Discipline', 'discipline_imposed'],
        ['Discipline Comments', 'discipline_comments'],
      ];

      conditionalColumns.forEach(([header, accessor]) => {
        if (hasNonEmptyColumn(accessor)) {
          baseColumns.push({ Header: header, accessor });
        }
      });
      
      return baseColumns;
    },
    [hasNonEmptyColumn]
  );


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<AgencyData>(
    {
      columns,
      data: agencyData,
    },
    useSortBy
  );

  const renderPagination = () => {
    const { currentPage, pageSize, totalPages } = paginationInfo;
    return (
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <button
          className={tableStyles.arrowButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={tableStyles.arrowButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span className={tableStyles.pageNumber}>
          Page {currentPage} of {totalPages}
        </span>
        <div className={tableStyles.selectWrapper}>
          <select
            className={tableStyles.showPages}
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              onPageSizeChange(newSize);
              onPageChange(1); // Reset to first page when changing page size
            }}
          >
            {[100, 200, 500, 10000].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const handleDownloadEntireCSV = async () => {
    setIsDownloadingCSV(true);
    try {
      const downloadUrl = await fetchEntireCSV();
      setCSVDownloadUrl(downloadUrl);
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Error fetching CSV download URL:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsDownloadingCSV(false);
    }
  };


  return (
    <div className={tableStyles.tableContainer}>
      {/* Filters */}
      <div className={tableStyles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { key: 'uid', placeholder: 'UID contains', filterKey: 'uid' },
            { key: 'lastName', placeholder: 'Last name contains', filterKey: 'lastName' },
            { key: 'firstName', placeholder: 'First name contains', filterKey: 'firstName' },
            { key: 'agencyName', placeholder: 'Agency contains', filterKey: 'agencyName' }
          ].map((filter) => (
            <div key={filter.key} className={tableStyles.searchBarContainer} style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
              <input
                type="text"
                value={localInputs[filter.filterKey as keyof Filters]}
                onChange={(e) => handleFilterChange(filter.filterKey as keyof Filters, e.target.value)}
                placeholder={filter.placeholder}
                className={tableStyles.searchInput}
              />
            </div>
          ))}
        </div>
      </div>
  
      {/* Table */}
      <div className={tableStyles.tableWrapper}>
        <table className={tableStyles.agencyTable} {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map(column => {
                  const columnWithSort = column as HeaderGroup<AgencyData> & UseSortByColumnProps<AgencyData>;
                  return (
                    <th {...column.getHeaderProps(columnWithSort.getSortByToggleProps())} key={column.id}>
                      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                        <span>{column.render('Header')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                          <FontAwesomeIcon 
                            icon={faChevronUp} 
                            className={`${tableStyles.arrowIcon} ${(columnWithSort.isSorted && !columnWithSort.isSortedDesc) ? tableStyles.activeSortIcon : ''}`}
                          />
                          <FontAwesomeIcon 
                            icon={faChevronDown} 
                            className={`${tableStyles.arrowIcon} ${(columnWithSort.isSorted && columnWithSort.isSortedDesc) ? tableStyles.activeSortIcon : ''}`}
                          />
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        </table>
        <div className={tableStyles.tableBodyContainer}>
          <table className={tableStyles.agencyTable} {...getTableProps()}>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map(cell => (
                      <td 
                        {...cell.getCellProps()} 
                        key={cell.column.id}
                        className={tableStyles.cellTooltip}
                        data-tooltip={cell.value}
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Pagination and CSV download buttons */}
           <div className={tableStyles.tableFooter}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '0 20px' }}>
          {renderPagination()}
          <CSVLink data={agencyData} filename={"filtered_agency_data.csv"} className={tableStyles.filteredcsvLink}>
            Download Filtered CSV
          </CSVLink>
          <button 
            onClick={handleDownloadEntireCSV} 
            className={tableStyles.fullcsvLink}
            disabled={isDownloadingCSV}
          >
            {isDownloadingCSV ? 'Preparing Download...' : 'Download Entire CSV'}
          </button>
        </div>
      </div>
      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default AgencyTable;