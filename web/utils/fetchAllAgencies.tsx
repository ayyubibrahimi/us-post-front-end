import path from 'path';
import Papa from 'papaparse';
import { promises as fs } from 'fs'; // This should only be used server-side

/**
 * This function should only be used in a server-side context, such as getStaticProps or getServerSideProps in Next.js
 */
export const fetchAllAgencyData = async () => {
    const filePath = path.join(process.cwd(), 'public', 'ga_fl.csv');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsedData = Papa.parse(fileContents, { header: true, skipEmptyLines: true });
    return parsedData.data;
};

/**
 * This function should also only be used in a server-side context, such as getStaticProps or getServerSideProps in Next.js
 */
export const fetchAgencyDataByState = async (state) => {
    const filePath = path.join(process.cwd(), 'public', 'ga_fl.csv');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsedData = Papa.parse(fileContents, { header: true, skipEmptyLines: true });
    const stateData = parsedData.data.filter(record => record.state === state);
    return stateData;
};
