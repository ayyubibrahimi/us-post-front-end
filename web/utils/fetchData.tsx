import Papa from 'papaparse';

export interface FetchOptions {
  pageIndex: number;
  pageSize: number;
}

export const fetchAgencyDataByState = async (
  state: string,
  options: FetchOptions,
  onProgress?: (data: any[], totalCount: number) => void
) => {
  try {
    console.log(`Starting data fetch for state: ${state}, page: ${options.pageIndex + 1}, size: ${options.pageSize}`);

    const response = await fetch(`/api/fetchStateData?state=${state}&page=${options.pageIndex + 1}&size=${options.pageSize}`);

    if (!response.ok) {
      throw new Error('Failed to fetch state data');
    }

    const { data: csvText, totalCount } = await response.json();
    console.log(`Received data: ${csvText.length} characters, totalCount=${totalCount}`);

    // Parse CSV data
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    console.log(`Parsed data: ${parsedData.data.length} rows, ${parsedData.meta.fields?.length} columns`);

    // Update the table progressively
    if (onProgress) {
      onProgress(parsedData.data, totalCount);
      console.log(`Progress callback called with ${parsedData.data.length} rows`);
    }

    return { data: parsedData.data, totalCount };
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
};