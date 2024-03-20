import React, { useMemo, useState } from 'react';
import tableStyles from './tableLight.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowUp, faArrowDown, faColumns } from '@fortawesome/free-solid-svg-icons';
import { useTable, useSortBy, usePagination } from 'react-table';

const AgencyTable = ({ agencyData }) => {
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [uidFilter, setUidFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    agcy_name: true,
    uid: true,
    first_name: true,
    last_name: true,
    employ_start_date: true,
    separation_date: true,
    separation_code: true,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgencyTypeModalVisible, setIsAgencyTypeModalVisible] = useState(false);
  const [agencyTypeFilter, setAgencyTypeFilter] = useState({
    'Police Department': true,
    "Sheriff's Office": true,
    'Corrections Department': true,
  });

  const toggleColumnVisibility = (columnName) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const filteredData = useMemo(() => {
    return agencyData.filter(row =>
      row.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()) &&
      row.first_name.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
      row.agcy_name.toLowerCase().includes(agencyFilter.toLowerCase()) &&
      row.uid.toLowerCase().includes(uidFilter.toLowerCase()) &&
      ((agencyTypeFilter['Police Department'] && row.agcy_name.toLowerCase().includes('police')) ||
      (agencyTypeFilter["Sheriff's Office"] && row.agcy_name.toLowerCase().includes('sheriff')) ||
      (agencyTypeFilter['Corrections Department'] && row.agcy_name.toLowerCase().includes('corrections')))
    );
  }, [agencyData, lastNameFilter, firstNameFilter, agencyFilter, uidFilter, agencyTypeFilter]);


  const columns = useMemo(
    () => [
      { Header: 'Agency Name', accessor: 'agcy_name' },
      { Header: 'UID', accessor: 'uid' },
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Last Name', accessor: 'last_name' },
      { Header: 'Start Date', accessor: 'employ_start_date' },
      { Header: 'Separation Date', accessor: 'separation_date' },
      { Header: 'Separation Reason', accessor: 'separation_code' },
    ],
    []
  );

  const filteredColumns = useMemo(() => {
    return columns.filter(column => columnVisibility[column.accessor]);
  }, [columns, columnVisibility]);

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
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  const pageCount = Math.ceil(filteredData.length / pageSize);

  const csvData = useMemo(() => filteredData.map(row => ({
    'Agency Name': row.agcy_name,
    'UID': row.uid,
    'First Name': row.first_name,
    'Last Name': row.last_name,
    'Start Date': row.employ_start_date,
    'Separation Date': row.separation_date,
    'Separation Reason': row.separation_code,
  })), [filteredData]);
 
 
return (
  <div className={tableStyles.tableContainer}>
    <div className={tableStyles.tableHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        {[{ state: uidFilter, setState: setUidFilter, placeholder: 'UID starts with' },
          { state: lastNameFilter, setState: setLastNameFilter, placeholder: 'Last name starts with' },
          { state: firstNameFilter, setState: setFirstNameFilter, placeholder: 'First name starts with' },
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
        <button onClick={() => setIsAgencyTypeModalVisible(true)} className={tableStyles.agencyVisibilityButton}>
          Agency Type
        </button>
        <button onClick={() => setIsModalVisible(true)} className={tableStyles.columnVisibilityButton}> Columns
        </button>
      </div>
    </div>

    {isModalVisible && (
      <div className={tableStyles.modalBackground}>
        <div className={tableStyles.modalContent}>
          <h2 className={tableStyles.modalHeader}>Select Columns</h2>
          {columns.map((column) => (
            <div key={column.accessor} className={tableStyles.modalCheckboxContainer}>
              <input
                type="checkbox"
                checked={columnVisibility[column.accessor]}
                onChange={() => toggleColumnVisibility(column.accessor)}
              />
              <span className={tableStyles.modalCheckboxLabel}>{column.Header}</span>
            </div>
          ))}
          <button onClick={() => setIsModalVisible(false)} className={tableStyles.closeButton}>
            Close
          </button>
        </div>
      </div>
    )}

    {isAgencyTypeModalVisible && (
      <div className={tableStyles.agencyTypeModalBackground}>
        <div className={tableStyles.agencyTypeModalContent}>
          <h2 className={tableStyles.agencyTypeModalHeader}>Select Agency Type</h2>
          {Object.keys(agencyTypeFilter).map((type) => (
            <div key={type} className={tableStyles.agencyTypeModalCheckboxContainer}>
              <input
                type="checkbox"
                checked={agencyTypeFilter[type]}
                onChange={() => setAgencyTypeFilter(prev => ({ ...prev, [type]: !prev[type] }))}
              />
              <span className={tableStyles.agencyTypeModalCheckboxLabel}>{type}</span>
            </div>
          ))}
          <button onClick={() => setIsAgencyTypeModalVisible(false)} className={tableStyles.closeButton}>
            Close
          </button>
        </div>
      </div>
    )}
    <table className={tableStyles.agencyTable} {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  <span>{column.render('Header')}</span>
                  <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                    {/* Apply the base class to both icons */}
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
        {page.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
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
        Page{' '}
          {pageIndex + 1} of {pageCount}
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