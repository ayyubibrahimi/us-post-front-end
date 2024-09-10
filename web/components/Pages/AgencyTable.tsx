import React, { useState, useCallback, useMemo, useEffect } from 'react';
import tableStyles from './tableLight.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, Column, UseSortByColumnOptions, UseSortByColumnProps, HeaderGroup } from 'react-table';
import { debounce } from 'lodash';

interface AgencyData {
  agency_name: string;
  person_nbr: string;
  first_name: string;
  last_name: string;
  start_date: string;
  end_date: string;
  separation_reason: string;
}

interface Filters {
  lastName: string;
  firstName: string;
  agencyName: string;
  uid: string;
}

interface AgencyTableProps {
  agencyData: AgencyData[];
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onFilterChange: (filters: Filters) => void;
  filters: Filters;
}

const AgencyTable: React.FC<AgencyTableProps> = ({
  agencyData,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  filters,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const debouncedFilterChange = useCallback(
    debounce((newFilters: Filters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    debouncedFilterChange(newFilters);
  }, [localFilters, debouncedFilterChange]);

  const hasSeparationReason = useMemo(() => {
    return agencyData.some(row => row.separation_reason && row.separation_reason.trim() !== '');
  }, [agencyData]);

  const columns = useMemo<Column<AgencyData>[]>(
    () => {
      const baseColumns: Column<AgencyData>[] = [
        { Header: 'Agency Name', accessor: 'agency_name' },
        { Header: 'UID', accessor: 'person_nbr' },
        { Header: 'First Name', accessor: 'first_name' },
        { Header: 'Last Name', accessor: 'last_name' },
        { Header: 'Start Date', accessor: 'start_date' },
        { Header: 'Separation Date', accessor: 'end_date' },
      ];
      
      if (hasSeparationReason) {
        baseColumns.push({ Header: 'Separation Reason', accessor: 'separation_reason' });
      }
      
      return baseColumns;
    },
    [hasSeparationReason]
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
                value={localFilters[filter.filterKey as keyof Filters]}
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
                            icon={faArrowUp} 
                            className={`${tableStyles.arrowIcon} ${(columnWithSort.isSorted && !columnWithSort.isSortedDesc) ? tableStyles.activeSortIcon : ''}`}
                          />
                          <FontAwesomeIcon 
                            icon={faArrowDown} 
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
  
      {/* Pagination */}
      <div className={tableStyles.tableFooter}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '0 20px' }}>
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
            >
              Next
            </button>
            <span className={tableStyles.pageNumber}>
              Page {currentPage} 
            </span>
            <div className={tableStyles.selectWrapper}>
              <select
                className={tableStyles.showPages}
                value={pageSize}
                onChange={(e) => {
                  onPageSizeChange(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <CSVLink data={agencyData} filename={"agency_data.csv"} className={tableStyles.csvLink}>
            Download CSV
          </CSVLink>
        </div>
      </div>
      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default AgencyTable;