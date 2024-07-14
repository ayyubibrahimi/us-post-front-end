import React, { useMemo, useState, useEffect } from 'react';
import tableStyles from './tableLight.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { TableInstance, UsePaginationInstanceProps, UsePaginationState, useTable, useSortBy, usePagination, Column, TableState, HeaderGroup } from 'react-table';

interface AgencyData {
  agcy_name: string;
  person_nbr: string;
  first_name: string;
  last_name: string;
  start_date: string;
  end_date: string;
  separation_reason: string;
}

interface AgencyTableProps {
  agencyData: AgencyData[];
}

const AgencyTable: React.FC<AgencyTableProps> = ({ agencyData }) => {
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [uidFilter, setUidFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    agcy_name: true,
    person_nbr: true,
    first_name: true,
    last_name: true,
    start_date: true,
    end_date: true,
    separation_reason: true,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgencyTypeModalVisible, setIsAgencyTypeModalVisible] = useState(false);
  const [agencyTypeFilter, setAgencyTypeFilter] = useState({
    'Police Department': true,
    "Sheriff's Office": true,
    'Corrections Department': true,
  });

  useEffect(() => {
    console.log('AgencyTable component mounted');
    console.log('Initial agencyData:', agencyData);
  }, [agencyData]);

  useEffect(() => {
    console.log('agencyData updated:', agencyData);
  }, [agencyData]);

  const toggleColumnVisibility = (columnName: keyof AgencyData) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const filteredData = useMemo(() => {
    console.log('Filtering data with:', { lastNameFilter, firstNameFilter, agencyFilter, uidFilter, agencyTypeFilter });
    const filtered = agencyData.filter(row =>
      row.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()) &&
      row.first_name.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
      row.agcy_name.toLowerCase().includes(agencyFilter.toLowerCase()) &&
      row.person_nbr.toLowerCase().includes(uidFilter.toLowerCase()) &&
      ((agencyTypeFilter['Police Department'] && row.agcy_name.toLowerCase().includes('police')) ||
      (agencyTypeFilter["Sheriff's Office"] && row.agcy_name.toLowerCase().includes('sheriff')) ||
      (agencyTypeFilter['Corrections Department'] && row.agcy_name.toLowerCase().includes('corrections')))
    );
    console.log('Filtered data:', filtered);
    return filtered;
  }, [agencyData, lastNameFilter, firstNameFilter, agencyFilter, uidFilter, agencyTypeFilter]);

  const columns: Column<AgencyData>[] = useMemo(
    () => [
      { Header: 'Agency Name', accessor: 'agcy_name' },
      { Header: 'UID', accessor: 'person_nbr' },
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Last Name', accessor: 'last_name' },
      { Header: 'Start Date', accessor: 'start_date' },
      { Header: 'Separation Date', accessor: 'end_date' },
      { Header: 'Separation Reason', accessor: 'separation_reason' },
    ],
    []
  );

  const filteredColumns = useMemo(() => {
    const filtered = columns.filter(column => columnVisibility[column.accessor as keyof AgencyData]);
    console.log('Filtered columns:', filtered);
    return filtered;
  }, [columns, columnVisibility]);

  type TableInstanceWithHooks<T extends object> = TableInstance<T> & 
    UsePaginationInstanceProps<T> & 
    { state: UsePaginationState<T> } & 
    {
      headerGroups: HeaderGroup<T>[];
    };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    gotoPage,
    setPageSize,
  } = useTable(
    {
      columns: filteredColumns,
      data: filteredData,
      initialState: { pageIndex: 0, pageSize: 10 } as Partial<TableState<AgencyData>> & Partial<UsePaginationState<AgencyData>>,
    },
    useSortBy,
    usePagination
  ) as TableInstanceWithHooks<AgencyData>;
  

  useEffect(() => {
    console.log('Table state updated:', { pageIndex, pageSize });
    console.log('Current page data:', page);
  }, [page, pageIndex, pageSize]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const csvData = useMemo(() => {
    const data = filteredData.map(row => ({
      'Agency Name': row.agcy_name,
      'UID': row.person_nbr,
      'First Name': row.first_name,
      'Last Name': row.last_name,
      'Start Date': row.start_date,
      'Separation Date': row.end_date,
      'Separation Reason': row.separation_reason,
    }));
    console.log('CSV data prepared:', data);
    return data;
  }, [filteredData]);

  return (
    <div className={tableStyles.tableContainer}>
      <div className={tableStyles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[{ state: uidFilter, setState: setUidFilter, placeholder: 'UID contains' },
            { state: lastNameFilter, setState: setLastNameFilter, placeholder: 'Last name contains' },
            { state: firstNameFilter, setState: setFirstNameFilter, placeholder: 'First name contains' },
            { state: agencyFilter, setState: setAgencyFilter, placeholder: 'Agency contains' }].map((filter, index) => (
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
  
      <table className={tableStyles.agencyTable} {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroup.id} {...restHeaderGroupProps}>
                {headerGroup.headers.map(column => {
                  const { key, ...restColumnProps } = column.getHeaderProps((column as any).getSortByToggleProps());
                  return (
                    <th key={column.id} {...restColumnProps}>
                      <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                        <span>{column.render('Header')}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                          <FontAwesomeIcon icon={faArrowUp} className={tableStyles.arrowIcon} />
                          <FontAwesomeIcon icon={faArrowDown} className={`${tableStyles.arrowIcon} ${tableStyles.arrowDown}`} />
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps(); // Destructure to remove key
            return (
              <tr key={row.id} {...restRowProps}>
                {row.cells.map(cell => {
                  const { key, ...restCellProps } = cell.getCellProps(); // Destructure to remove key
                  return (
                    <td key={cell.column.id} {...restCellProps}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={tableStyles.tableFooter}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', padding: '0 20px' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <button className={tableStyles.arrowButton} onClick={previousPage} disabled={!canPreviousPage}>
              {'Previous'}
            </button>
            <button className={tableStyles.arrowButton} onClick={nextPage} disabled={!canNextPage}>
              {'Next'}
            </button>
            <span className={tableStyles.pageNumber}>
              Page {pageIndex + 1} of {pageCount}
            </span>
            <div className={tableStyles.selectWrapper}>
              <select
                className={tableStyles.showPages}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
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
    </div>
  );
};

export default AgencyTable;
