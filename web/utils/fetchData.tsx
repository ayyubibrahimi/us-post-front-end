import Papa from 'papaparse';

export const fetchAgencyDataByState = async (state: string) => {
  try {
    const response = await fetch(`/api/fetchStateData?state=${state}`);
    if (!response.ok) {
      throw new Error('Failed to fetch state data');
    }
    const { data: csvText } = await response.json();
    return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
  } catch (error) {
    console.error("Error fetching state data:", error);
    throw error;
  }
};

// We can remove the fetchAllAgencyData function if it's no longer needed