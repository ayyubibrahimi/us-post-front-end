import Papa from 'papaparse';

export const fetchAgencyDataByState = async (state: string) => {
  try {
    console.log(`Starting data fetch for state: ${state}`);

    const response = await fetch(`/api/fetchStateData?state=${state}`);

    if (!response.ok) {
      throw new Error('Failed to fetch state data');
    }

    const { data: csvText, totalCount } = await response.json();
    console.log(`Received data: ${csvText.length} characters, totalCount=${totalCount}`);

    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    console.log(`Parsed data: ${parsedData.data.length} rows, ${parsedData.meta.fields?.length} columns`);

    return { data: parsedData.data, totalCount };
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw error;
  }
};