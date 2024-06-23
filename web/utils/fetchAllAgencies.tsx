// utils/fetchData.tsx
import { storage, ref, getDownloadURL } from './firebaseConfig';
import Papa from 'papaparse';

export const fetchAllAgencyData = async () => {
    const fileRef = ref(storage, 'arizona-processed.csv');
    const fileURL = await getDownloadURL(fileRef);
    const response = await fetch(fileURL);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    return parsedData.data;
};

export const fetchAgencyDataByState = async (state: string) => {
    const fileRef = ref(storage, 'arizona-processed.csv');
    const fileURL = await getDownloadURL(fileRef);
    const response = await fetch(fileURL);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const stateData = parsedData.data.filter((record: any) => record.state === state);
    return stateData;
};
