import React, { useMemo, useState } from 'react';
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
}

const AgencyTable: React.FC<AgencyTableProps> = ({
  agencyData,
  totalCount,
  isLoading
}) => {
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [uidFilter, setUidFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const filteredData = useMemo(() => {
    return agencyData.filter(row => {
      if (lastNameFilter && (!row.last_name || !row.last_name.toLowerCase().startsWith(lastNameFilter.toLowerCase()))) {
        return false;
      }
      if (firstNameFilter && (!row.first_name || !row.first_name.toLowerCase().startsWith(firstNameFilter.toLowerCase()))) {
        return false;
      }
      if (agencyFilter && (!row.agency_name || !row.agency_name.toLowerCase().startsWith(agencyFilter.toLowerCase()))) {
        return false;
      }
      if (uidFilter && (!row.person_nbr || !row.person_nbr.toLowerCase().startsWith(uidFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [agencyData, lastNameFilter, firstNameFilter, agencyFilter, uidFilter]);

  const paginatedData = useMemo(() => {
    const startRow = pageIndex * pageSize;
    return filteredData.slice(startRow, startRow + pageSize);
  }, [filteredData, pageIndex, pageSize]);

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
      data: paginatedData,
    },
    useSortBy
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const csvData = useMemo(() => {
    return filteredData.map(row => ({
      'Agency Name': row.agency_name,
      'UID': row.person_nbr,
      'First Name': row.first_name,
      'Last Name': row.last_name,
      'Start Date': row.start_date,
      'Separation Date': row.end_date,
      'Separation Reason': row.separation_reason,
    }));
  }, [filteredData]);

  return (
    <div className={tableStyles.tableContainer}>
      {/* Filters */}
      <div className={tableStyles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { state: uidFilter, setState: setUidFilter, placeholder: 'UID contains' },
            { state: lastNameFilter, setState: setLastNameFilter, placeholder: 'Last name contains' },
            { state: firstNameFilter, setState: setFirstNameFilter, placeholder: 'First name contains' },
            { state: agencyFilter, setState: setAgencyFilter, placeholder: 'Agency contains' }
          ].map((filter, index) => (
            <div key={index} className={tableStyles.searchBarContainer} style={{ position: 'relative' }}>
              <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
              <input
                type="text"
                value={filter.state}
                onChange={(e) => filter.setState(e.target.value)}
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
                      <FontAwesomeIcon icon={faArrowUp} className={tableStyles.arrowIcon} />
                      <FontAwesomeIcon icon={faArrowDown} className={`${tableStyles.arrowIcon} ${tableStyles.arrowDown}`} />
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
              onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
              disabled={pageIndex === 0}
            >
              Previous
            </button>
            <button
              className={tableStyles.arrowButton}
              onClick={() => setPageIndex(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={pageIndex === totalPages - 1}
            >
              Next
            </button>
            <span className={tableStyles.pageNumber}>
              Page {pageIndex + 1} of {totalPages}
            </span>
            <div className={tableStyles.selectWrapper}>
              <select
                className={tableStyles.showPages}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPageIndex(0);
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
          <CSVLink data={csvData} filename={"agency_data.csv"} className={tableStyles.csvLink}>
            Download CSV
          </CSVLink>
        </div>
      </div>
      {isLoading && <p>Loading data...</p>}
    </div>
  );
};

export default AgencyTable;