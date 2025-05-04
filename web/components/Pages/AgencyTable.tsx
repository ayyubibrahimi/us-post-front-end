import React, { useState, useCallback, useMemo, useEffect } from 'react';
import tableStyles from './table.module.scss';
import { CSVLink } from 'react-csv';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi, IFilterParams } from 'ag-grid-community';
import { debounce } from 'lodash';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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
  middleName: string;
  firstName: string;
  agencyName: string;
  uid: string;
  startDate: string;
  endDate: string;
  columnFilters?: any;
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
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [csvDownloadUrl, setCSVDownloadUrl] = useState<string | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Map grid fields to filter fields
  const fieldMapping = {
    person_nbr: 'uid',
    middle_name: 'middleName',
    last_name: 'lastName',
    first_name: 'firstName',
    agency_name: 'agencyName',
    start_date: 'startDate',
    end_date: 'endDate',
  };

  // Debounced filter change to prevent too many backend calls
  const debouncedFilterChange = useMemo(
    () =>
      debounce((filters: Filters) => {
        onFilterChange(filters);
        onPageChange(1); // Reset to first page when filters change
      }, 300),
    [onFilterChange, onPageChange],
  );

  const onFilterChanged = useCallback(() => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel();
      const updatedFilters: Filters = {
        lastName: '',
        middleName: '',
        firstName: '',
        agencyName: '',
        uid: '',
        startDate: '',
        endDate: '',
      };

      // Convert grid filter model to our filter format
      Object.entries(filterModel).forEach(([field, filterValue]) => {
        const mappedField = fieldMapping[field as keyof typeof fieldMapping];
        if (mappedField && filterValue) {
          updatedFilters[mappedField as keyof Filters] = (filterValue as any).filter || '';
        }
      });

      debouncedFilterChange(updatedFilters);
    }
  }, [gridApi, debouncedFilterChange]);

  // Set initial filters when component mounts or filters prop changes
  useEffect(() => {
    if (gridApi && filters) {
      const filterModel: any = {};
      Object.entries(fieldMapping).forEach(([gridField, filterKey]) => {
        const filterValue = filters[filterKey as keyof Filters];
        if (filterValue) {
          filterModel[gridField] = {
            type: 'contains',
            filter: filterValue,
          };
        }
      });
      gridApi.setFilterModel(filterModel);
    }
  }, [gridApi, filters]);

  const hasNonEmptyColumn = useCallback(
    (columnName: keyof AgencyData) => {
      return agencyData.some((row) => row[columnName] && row[columnName]!.trim() !== '');
    },
    [agencyData],
  );

  // const getFilterParams = (field: string): IFilterParams => {
  //   return {
  //     buttons: ['apply', 'reset'],
  //     closeOnApply: true,
  //     filterOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
  //   };
  // };

  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'UID',
        field: 'person_nbr',
        sortable: true,
        filter: true,
        // filterParams: getFilterParams('person_nbr'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: 'First Name',
        field: 'first_name',
        sortable: true,
        filter: 'agTextColumnFilter',
        // filterParams: getFilterParams('first_name'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 120,
      },
    ];

    if (hasNonEmptyColumn('middle_name')) {
      baseColumns.push({
        headerName: 'Middle Name',
        field: 'middle_name',
        sortable: true,
        filter: true,
        // filterParams: getFilterParams('middle_name'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 120,
      });
    }

    baseColumns.push(
      {
        headerName: 'Last Name',
        field: 'last_name',
        sortable: true,
        filter: 'agTextColumnFilter',
        // filterParams: getFilterParams('last_name'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: 'Agency Name',
        field: 'agency_name',
        sortable: true,
        filter: true,
        // filterParams: getFilterParams('agency_name'),
        tooltipValueGetter: (params) => params.value,
        flex: 1.5,
        minWidth: 150,
      },
      {
        headerName: 'Start Date',
        field: 'start_date',
        sortable: true,
        filter: false,
        // filterParams: getFilterParams('start_date'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 110,
      },
      {
        headerName: 'End Date',
        field: 'end_date',
        sortable: true,
        filter: false,
        // filterParams: getFilterParams('end_date'),
        tooltipValueGetter: (params) => params.value,
        flex: 1,
        minWidth: 110,
      },
    );

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
      ['Separation Reason', 'separation_reason'],
    ];

    conditionalColumns.forEach(([header, field]) => {
      if (hasNonEmptyColumn(field)) {
        baseColumns.push({
          headerName: header,
          field,
          sortable: true,
          filter: false,
          // filterParams: getFilterParams(field),
          tooltipValueGetter: (params) => params.value,
          flex: 1,
          minWidth: 120,
        });
      }
    });

    return baseColumns;
  }, [hasNonEmptyColumn]);

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: false,
      tooltipShowDelay: 0,
      tooltipHideDelay: 2000,
      floatingFilter: true, // Remove the default filter property
      suppressMenu: false,
      unSortIcon: true,
      suppressSortIcons: false,
    }),
    [],
  );

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const renderPagination = () => {
    const { currentPage, pageSize, totalPages } = paginationInfo;
    return (
      <div className={tableStyles.pagination}>
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
              onPageChange(1);
            }}
          >
            {[100, 200, 500, 10000].map((size) => (
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
    } finally {
      setIsDownloadingCSV(false);
    }
  };

  return (
    <div className={tableStyles.tableContainer}>
      <div className={tableStyles.tableWrapper} style={{ marginTop: '1rem' }}>
        <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
          <AgGridReact
            rowData={agencyData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onFilterChanged={onFilterChanged}
            tooltipShowDelay={0}
            enableBrowserTooltips
            suppressCellFocus
            suppressMovableColumns
            suppressRowHoverHighlight={false}
            rowHeight={40}
            headerHeight={48}
            animateRows
            pagination={false}
            suppressPaginationPanel={true}
            enableCellTextSelection
          />
        </div>
      </div>

      <div className={tableStyles.tableFooter}>
        <div className={tableStyles.footerContent}>
          {renderPagination()}
          <div className={tableStyles.csvButtons}>
            <CSVLink data={agencyData} filename="filtered_agency_data.csv" className={tableStyles.filteredcsvLink}>
              Download Filtered CSV
            </CSVLink>
            <button onClick={handleDownloadEntireCSV} className={tableStyles.fullcsvLink} disabled={isDownloadingCSV}>
              {isDownloadingCSV ? 'Preparing Download...' : 'Download Entire CSV'}
            </button>
          </div>
        </div>
      </div>

      {isLoading && <div className={tableStyles.loadingOverlay}>Loading data...</div>}
    </div>
  );
};

export default AgencyTable;
