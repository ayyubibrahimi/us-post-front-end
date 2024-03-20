// fetchCsvData.ts
import Papa from 'papaparse';

interface EmploymentData {
  uid: string;
  employ_start_date: string;
  separation_date: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  separation_code: string; 
  agcy_name: string; 
  latitude: string;
  longitude: string;
}

export async function fetchCSV(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
}

export async function parseCsvData(csvString: string): Promise<EmploymentData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      complete: (results) => {
        resolve(results.data as EmploymentData[]);
      },
      error: (error) => reject(error),
    });
  });
}

