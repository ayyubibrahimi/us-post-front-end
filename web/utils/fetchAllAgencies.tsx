// utils/fetchAllAgencies.tsx
import { storage, ref, getDownloadURL } from './firebaseConfig';
import Papa from 'papaparse';

type StateMap = {
  [key: string]: string;
};

const stateMap: StateMap = {
  'Washington': 'washington-processed.csv',
  'Virginia': 'virginia-processed.csv',
  'Texas': 'texas-processed.csv',
  'Tennessee': 'tennessee-processed.csv',
  'South Carolina': 'south-carolina-processed.csv',
  'Oregon': 'oregon-processed.csv',
  'Ohio': 'ohio-processed.csv',
  'Maryland': 'maryland-processed.csv',
  'Illinois': 'illinois-processed.csv',
  'Georgia': 'georgia-processed.csv',
  'Florida': 'florida-processed.csv',
  'California': 'california-processed.csv',
  'Arizona': 'arizona-processed.csv'
};

const getStateFileName = (state: string): string => {
  return stateMap[state] || 'arizona-processed.csv';
};

const fetchCSVData = async (fileName: string) => {
  const fileRef = ref(storage, fileName);
  const fileURL = await getDownloadURL(fileRef);
  const response = await fetch(fileURL);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
};

export const fetchAllAgencyData = async () => {
  const allData = [];
  const states = Object.keys(stateMap);

  for (const state of states) {
    const fileName = getStateFileName(state);
    const stateData = await fetchCSVData(fileName);
    allData.push(...stateData);
  }

  return allData;
};

export const fetchAgencyDataByState = async (state: string) => {
  const fileName = getStateFileName(state);
  return await fetchCSVData(fileName);
};