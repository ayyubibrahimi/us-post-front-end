import Papa from 'papaparse';

export const fetchAgencyDataByState = async (state: string, offset: number = 0, limit: number = 100) => {
  try {
    const response = await fetch(`/api/fetchStateData?state=${state}&offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch state data');
    }
    const { data: csvText, totalCount, hasMore } = await response.json();
    
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

    return {
      data: parsedData,
      nextOffset: offset + parsedData.length,
      hasMore,
      totalCount
    };
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};