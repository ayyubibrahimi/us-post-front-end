import React, { useState, useCallback, useMemo } from 'react';
import tableStyles from './tableLight.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, Column } from 'react-table';

interface AgencyData {
  agency_name?: string;
  person_nbr?: string;
  first_name?: string;
  last_name?: string;
  start_date?: string;
  end_date?: string;
  separation_reason?: string;
}

interface AgencyTableProps {
  agencyData: AgencyData[];
  totalCount: number;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AgencyTable: React.FC<AgencyTableProps> = ({
  agencyData,
  totalCount,
  isLoading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [filters, setFilters] = useState({
    person_nbr: '',
    last_name: '',
    first_name: '',
    agency_name: ''
  });

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const filteredData = useMemo(() => {
    return agencyData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        return item[key as keyof AgencyData]?.toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [agencyData, filters]);

  const columns: Column<AgencyData>[] = useMemo(
    () => [
      { Header: 'Agency Name', accessor: 'agency_name' },
      { Header: 'UID', accessor: 'person_nbr' },
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Last Name', accessor: 'last_name' },
      { Header: 'Start Date', accessor: 'start_date' },
      { Header: 'Separation Date', accessor: 'end_date' },
      { Header: 'Separation Reason', accessor: 'separation_reason' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredData,
    },
    useSortBy
  );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className={tableStyles.tableContainer}>
      {/* Filters */}
      <div className={tableStyles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { key: 'person_nbr', placeholder: 'UID contains' },
            { key: 'last_name', placeholder: 'Last name contains' },
            { key: 'first_name', placeholder: 'First name contains' },
            { key: 'agency_name', placeholder: 'Agency contains' }
          ].map((filter) => (
            <div key={filter.key} className={tableStyles.searchBarContainer} style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
              <input
                type="text"
                value={filters[filter.key as keyof typeof filters]}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                placeholder={filter.placeholder}
                className={tableStyles.searchInput}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className={tableStyles.agencyTable} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps((column as any).getSortByToggleProps())} key={column.id}>
                  <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <span>{column.render('Header')}</span>
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                      <FontAwesomeIcon 
                        icon={faArrowUp} 
                        className={`${tableStyles.arrowIcon} ${(column as any).isSorted && !(column as any).isSortedDesc ? tableStyles.activeSortIcon : ''}`}
                      />
                      <FontAwesomeIcon 
                        icon={faArrowDown} 
                        className={`${tableStyles.arrowIcon} ${tableStyles.arrowDown} ${(column as any).isSorted && (column as any).isSortedDesc ? tableStyles.activeSortIcon : ''}`}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

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
          <CSVLink data={filteredData} filename={"agency_data.csv"} className={tableStyles.csvLink}>
            Download CSV
          </CSVLink>
        </div>
      </div>
      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default AgencyTable;