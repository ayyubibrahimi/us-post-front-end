import Papa from 'papaparse';

let cachedHeaders: string[] | null = null; // Cache to store headers from the first chunk

export const fetchAgencyDataByState = async (
  state: string,
  offset: number = 0,
  limit: number = 50,
  onProgress?: (data: any) => void // A callback function for progressive updates
) => {
  try {
    let allData: any[] = [];
    let totalFetched = 0;
    console.log(`Starting data fetch for state: ${state}`);

    // Continue fetching until all data is loaded
    while (true) {
      console.log(`Fetching chunk: offset=${offset}, limit=${limit}`);
      const response = await fetch(`/api/fetchStateData?state=${state}&offset=${offset}&limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch state data');
      }

      const { data: csvText, totalCount, hasMore } = await response.json();
      console.log(`Received chunk: ${csvText.length} characters, totalCount=${totalCount}, hasMore=${hasMore}`);

      // Parse CSV data
      if (offset === 0 && !cachedHeaders) {
        // For the first chunk, parse with headers and cache them
        const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        cachedHeaders = parsedData.meta.fields || [];
        allData = [...allData, ...parsedData.data];
        console.log(`Parsed first chunk: ${parsedData.data.length} rows, cached ${cachedHeaders.length} headers`);
      } else {
        // For subsequent chunks, parse without headers and align with cached headers
        const parsedData = Papa.parse(csvText, { header: false, skipEmptyLines: true }).data;
        const rowsWithHeaders = parsedData.map((row: any) =>
          Object.fromEntries(cachedHeaders!.map((header, i) => [header, row[i]]))
        );
        allData = [...allData, ...rowsWithHeaders];
        console.log(`Parsed subsequent chunk: ${rowsWithHeaders.length} rows`);
      }

      totalFetched += allData.length;
      console.log(`Total rows fetched so far: ${totalFetched}`);

      // Update the table progressively
      if (onProgress) {
        onProgress(allData); // Call the callback with progressively fetched data
        console.log(`Progress callback called with ${allData.length} rows`);
      }

      // Break if no more data to fetch
      if (!hasMore) {
        console.log(`All data fetched. Total rows: ${totalFetched}`);
        break;
      }

      offset += limit; // Increment the offset to load the next chunk
      console.log(`Moving to next chunk. New offset: ${offset}`);
    }

    return allData;
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
};