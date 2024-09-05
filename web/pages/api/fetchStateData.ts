import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  try {
    const formattedState = state.toLowerCase().replace(/\s+/g, '-');
    const fileName = `${formattedState}-processed.csv.gz`;
    const fileRef = ref(storage, fileName);
    const fileURL = await getDownloadURL(fileRef);

    const response = await fetch(fileURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const gunzip = createGunzip();

    // Convert the ReadableStream to a Node.js Readable stream
    const responseBuffer = await response.arrayBuffer();
    const responseStream = Readable.from(Buffer.from(responseBuffer));

    const decompressedStream = responseStream.pipe(gunzip);

    let csvData = '';
    for await (const chunk of decompressedStream) {
      csvData += chunk.toString();
    }

    const rows = csvData.split('\n');
    const headerRow = rows.shift()!;
    const dataRows = rows.filter(row => row.trim() !== ''); // Remove any empty rows

    res.status(200).json({
      data: csvData,
      totalCount: dataRows.length
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}