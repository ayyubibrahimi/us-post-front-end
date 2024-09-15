import React, { useState, useCallback, useMemo } from 'react';
import tableStyles from './tableLight.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
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
      const baseColumns: Column<AgencyData>[] = [
        { Header: 'First Name', accessor: 'first_name' },
      ];
      
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
        { Header: 'UID', accessor: 'person_nbr' }
      );
      
      // Add other conditional columns
      const conditionalColumns: [string, keyof AgencyData][] = [
        ['Birth Year', 'year_of_birth'],
        ['Race', 'race'],
        ['Sex', 'sex'],
        ['Case ID', 'case_id'],
        ['Violation', 'violation'],
        ['Violation Date', 'violation_date'],
        ['Sanction', 'sanction'],
        ['Sanction Date', 'sanction_date'],
        ['Employment Status', 'employment_status'],
        ['Employment Status', 'employment_change'],
        ['Separation Reason', 'separation_reason'],
        ['Offense', 'offense'],
        ['Discipline Imposed', 'discipline_imposed'],
        ['Discipline Comments', 'discipline_comments'],
        ['Case Open Date', 'case_opened_date'],
        ['Case Close Date', 'case_closed_date'],
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
                {[10, 20, 30, 40, 50, 100, 10000].map(size => (
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