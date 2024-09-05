import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';
import Papa from 'papaparse';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, page = '1', pageSize = '10' } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  const currentPage = parseInt(Array.isArray(page) ? page[0] : page, 10);
  const size = parseInt(Array.isArray(pageSize) ? pageSize[0] : pageSize, 10);

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
    const responseBuffer = await response.arrayBuffer();
    const responseStream = Readable.from(Buffer.from(responseBuffer));
    const decompressedStream = responseStream.pipe(gunzip);

    let csvData = '';
    for await (const chunk of decompressedStream) {
      csvData += chunk.toString();
    }

    const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    const totalCount = parsedData.data.length;

    const startIndex = (currentPage - 1) * size;
    const endIndex = startIndex + size;
    const paginatedData = parsedData.data.slice(startIndex, endIndex);

    res.status(200).json({
      data: paginatedData,
      totalCount: totalCount,
      currentPage: currentPage,
      pageSize: size,
      totalPages: Math.ceil(totalCount / size)
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}