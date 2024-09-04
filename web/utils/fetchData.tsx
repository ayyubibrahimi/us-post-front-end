import Papa from 'papaparse';

let cachedHeaders: string[] | null = null; // Cache to store headers from the first chunk

export const fetchAgencyDataByState = async (state: string, offset: number = 0, limit: number = 50) => {
  try {
    const response = await fetch(`/api/fetchStateData?state=${state}&offset=${offset}&limit=${limit}`);

    if (!response.ok) {
      throw new Error('Failed to fetch state data');
    }

    const { data: csvText, totalCount, hasMore } = await response.json();

    if (offset === 0) {
      // Parse with header for the first chunk and cache the headers
      const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      cachedHeaders = parsedData.meta.fields || []; // Cache the headers
      return {
        data: parsedData.data,
        hasMore,
        totalCount
      };
    } else {
      // Parse without headers for subsequent chunks
      const parsedData = Papa.parse(csvText, {
        header: false,  // Don't expect headers in subsequent chunks
        skipEmptyLines: true
      }).data;

      // Ensure the column order matches the cached headers
      const rowsWithCorrectOrder = parsedData.map((row: any) =>
        Object.fromEntries(cachedHeaders!.map((header, i) => [header, row[i]]))
      );

      return {
        data: rowsWithCorrectOrder,
        hasMore,
        totalCount
      };
    }
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
};
