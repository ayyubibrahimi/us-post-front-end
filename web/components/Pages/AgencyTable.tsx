import React, { useState, useCallback, useMemo, useEffect } from 'react';
import tableStyles from './table.module.scss';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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
  firstName: string;
  agencyName: string;
  uid: string;
  startDate: string;
  endDate: string;
  columnFilters?: Record<string, any>;
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
  const [localInputs, setLocalInputs] = useState(filters);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Update grid filters when top search inputs change
  useEffect(() => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel();
      
      // Map of input fields to column fields
      const fieldMapping = {
        uid: 'person_nbr',
        lastName: 'last_name',
        firstName: 'first_name',
        agencyName: 'agency_name',
        startDate: 'start_date',
        endDate: 'end_date',
      };

      // Update filter model based on search inputs
      Object.entries(localInputs).forEach(([key, value]) => {
        const columnField = fieldMapping[key as keyof typeof fieldMapping];
        if (columnField && value) {
          filterModel[columnField] = {
            type: 'contains',
            filter: value
          };
        } else if (columnField) {
          delete filterModel[columnField];
        }
      });

      gridApi.setFilterModel(filterModel);
    }
  }, [localInputs, gridApi]);

  const hasNonEmptyColumn = useCallback((columnName: keyof AgencyData) => {
    return agencyData.some(row => row[columnName] && row[columnName]!.trim() !== '');
  }, [agencyData]);

  const debouncedFilterChange = useMemo(
    () => debounce((newFilters: Filters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const updatedInputs = { ...localInputs, [key]: value };
    setLocalInputs(updatedInputs);
    
    // Always include the current column filters
    if (gridApi) {
      const filterModel = gridApi.getFilterModel();
      debouncedFilterChange({ 
        ...updatedInputs,
        columnFilters: filterModel 
      });
    } else {
      debouncedFilterChange(updatedInputs);
    }
  }, [debouncedFilterChange, localInputs, gridApi]);

  const onFilterChanged = useCallback(() => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel();
      
      // Update local inputs based on column filters for synchronized fields
      const fieldMapping = {
        person_nbr: 'uid',
        last_name: 'lastName',
        first_name: 'firstName',
        agency_name: 'agencyName',
        start_date: 'startDate',
        end_date: 'endDate',
      };

      const updatedInputs = { ...localInputs };
      Object.entries(filterModel).forEach(([field, filterValue]) => {
        const inputField = fieldMapping[field as keyof typeof fieldMapping];
        if (inputField && filterValue) {
          updatedInputs[inputField as keyof Filters] = (filterValue as any).filter || '';
        }
      });

      setLocalInputs(updatedInputs);
      debouncedFilterChange({
        ...updatedInputs,
        columnFilters: filterModel
      });
    }
  }, [gridApi, localInputs, debouncedFilterChange]);

  const tooltipValueGetter = (params: any) => {
    return params.value;
  };

  const getFilterParams = (field: string): IFilterParams => {
    const isSynchronizedField = ['person_nbr', 'last_name', 'first_name', 'agency_name', 'start_date', 'end_date'].includes(field);
    
    return {
      filterOptions: ['contains'],
      defaultOption: 'contains',
      buttons: ['apply', 'reset'],
      debounceMs: 200,
      suppressAndOrCondition: true,
    };
  };

  const columnDefs = useMemo<ColDef[]>(() => {
    const baseColumns: ColDef[] = [
      {
        headerName: 'UID',
        field: 'person_nbr',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('person_nbr'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1,
        minWidth: 100
      },
      {
        headerName: 'First Name',
        field: 'first_name',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('first_name'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1,
        minWidth: 120
      }
    ];

    if (hasNonEmptyColumn('middle_name')) {
      baseColumns.push({
        headerName: 'Middle Name',
        field: 'middle_name',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('middle_name'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1,
        minWidth: 120
      });
    }

    baseColumns.push({
      headerName: 'Last Name',
      field: 'last_name',
      sortable: true,
      filter: true,
      filterParams: getFilterParams('last_name'),
      tooltipValueGetter: tooltipValueGetter,
      flex: 1,
      minWidth: 120
    });

    if (hasNonEmptyColumn('suffix')) {
      baseColumns.push({
        headerName: 'Suffix',
        field: 'suffix',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('suffix'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 0.7,
        minWidth: 80
      });
    }

    baseColumns.push(
      {
        headerName: 'Start Date',
        field: 'start_date',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('start_date'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1,
        minWidth: 110
      },
      {
        headerName: 'End Date',
        field: 'end_date',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('end_date'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1,
        minWidth: 110
      },
      {
        headerName: 'Agency Name',
        field: 'agency_name',
        sortable: true,
        filter: true,
        filterParams: getFilterParams('agency_name'),
        tooltipValueGetter: tooltipValueGetter,
        flex: 1.5,
        minWidth: 150
      }
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
    ];

    conditionalColumns.forEach(([header, field]) => {
      if (hasNonEmptyColumn(field)) {
        baseColumns.push({
          headerName: header,
          field,
          sortable: true,
          filter: true,
          filterParams: getFilterParams(field),
          tooltipValueGetter: tooltipValueGetter,
          flex: 1,
          minWidth: 120
        });
      }
    });

    return baseColumns;
  }, [hasNonEmptyColumn]);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    tooltipShowDelay: 0,
    tooltipHideDelay: 2000,
    filter: true,
  }), []);

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
    } finally {
      setIsDownloadingCSV(false);
    }
  };


  return (
    <div className={tableStyles.tableContainer}>
      <div className={tableStyles.tableHeader}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'uid', placeholder: 'UID contains', filterKey: 'uid' },
            { key: 'lastName', placeholder: 'Last name contains', filterKey: 'lastName' },
            { key: 'firstName', placeholder: 'First name contains', filterKey: 'firstName' },
            { key: 'agencyName', placeholder: 'Agency contains', filterKey: 'agencyName' },
            { key: 'startDate', placeholder: 'Start date', filterKey: 'startDate' },
            { key: 'endDate', placeholder: 'End date', filterKey: 'endDate' },
          ].map((filter) => (
            <div key={filter.key} className={tableStyles.searchBarContainer}>
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

      <div className={tableStyles.tableWrapper}>
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
            pagination={true}
            paginationPageSize={paginationInfo.pageSize}
            cacheBlockSize={paginationInfo.pageSize}
            onPaginationChanged={() => {
              if (gridApi) {
                const currentPage = gridApi.paginationGetCurrentPage();
                onPageChange(currentPage + 1);
              }
            }}
          />
        </div>
      </div>

      <div className={tableStyles.tableFooter}>
        <div className={tableStyles.footerContent}>
          {renderPagination()}
          <div className={tableStyles.csvButtons}>
            <CSVLink 
              data={agencyData} 
              filename="filtered_agency_data.csv"
              className={tableStyles.filteredcsvLink}
            >
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
      </div>

      {isLoading && (
        <div className={tableStyles.loadingOverlay}>
          Loading data...
        </div>
      )}
    </div>
  );
};

export default AgencyTable;