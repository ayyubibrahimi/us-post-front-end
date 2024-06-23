import { storage } from './firebaseConfig';
import { ref, getBytes } from "firebase/storage";
import Papa from 'papaparse';

export const fetchAgencyDataByState = async (state: string) => {
  const fileRef = ref(storage, `${state.toLowerCase()}-processed.csv`);
  
  try {
    const buffer = await getBytes(fileRef);
    const csvText = new TextDecoder().decode(buffer);
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error(`Error fetching data for ${state}:`, error);
    throw error;
  }
};