import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const CHUNK_SIZE = 100000; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, offset, limit } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  const startOffset = offset ? parseInt(offset as string, 10) : 0;
  const pageLimit = limit ? parseInt(limit as string, 10) : 100;

  try {
    const fileName = `${state.toLowerCase()}-processed.csv`;
    const fileRef = ref(storage, fileName);
    const fileURL = await getDownloadURL(fileRef);
    
    const response = await fetch(fileURL, {
      headers: {
        Range: `bytes=${startOffset}-${startOffset + CHUNK_SIZE - 1}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chunk = await response.text();
    const contentRange = response.headers.get('Content-Range');
    const totalSize = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;

    // Simulate parsing only the requested number of rows
    const allRows = chunk.split('\n');
    const headerRow = allRows[0];
    const dataRows = allRows.slice(1, pageLimit + 1);
    const csvChunk = [headerRow, ...dataRows].join('\n');

    const hasMore = startOffset + chunk.length < totalSize;

    res.status(200).json({
      data: csvChunk,
      totalCount: totalSize,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}