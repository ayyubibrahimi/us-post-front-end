import Papa from 'papaparse';

export const fetchAgencyDataByState = async (
  state: string,
  onProgress?: (data: any) => void // A callback function for progressive updates
) => {
  try {
    console.log(`Starting data fetch for state: ${state}`);

    const response = await fetch(`/api/fetchStateData?state=${state}`);

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
      onProgress(parsedData.data);
      console.log(`Progress callback called with ${parsedData.data.length} rows`);
    }

    return parsedData.data;
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
};