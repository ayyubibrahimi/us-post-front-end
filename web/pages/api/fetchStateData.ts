import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const CHUNK_SIZE = 1000000; // Adjust chunk size based on performance needs

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state, offset, limit } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  const startOffset = offset ? parseInt(offset as string, 10) : 0;
  const pageLimit = limit ? parseInt(limit as string, 10) : 50;

  try {
    const fileName = `${state.toLowerCase()}-processed.csv`;
    const fileRef = ref(storage, fileName);
    const fileURL = await getDownloadURL(fileRef);

    let byteOffset = startOffset;
    const response = await fetch(fileURL, {
      headers: {
        Range: `bytes=${byteOffset}-${byteOffset + CHUNK_SIZE - 1}`
      }
    });

    if (response.status === 416) {
      // We've reached the end of the file
      return res.status(200).json({
        data: '',
        totalCount: byteOffset,
        hasMore: false
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const chunk = await response.text();
    const contentRange = response.headers.get('Content-Range');
    const totalSize = contentRange ? parseInt(contentRange.split('/')[1], 10) : 0;

    // Split the chunk by lines to ensure we have full rows
    const allRows = chunk.split('\n');
    
    // Extract the header from the first chunk (assumes header in the first chunk)
    const headerRow = allRows[0];
    let dataRows = allRows.slice(1); // Remove the header row from the current chunk

    // Ensure the last row is complete; discard incomplete rows
    if (!dataRows[dataRows.length - 1].endsWith('\n')) {
      dataRows = dataRows.slice(0, -1); // Remove incomplete row
    }
    // Limit the number of rows to match the requested page size
    const slicedRows = dataRows.slice(0, pageLimit);

    // Combine the header with the sliced rows
    const csvChunk = [headerRow, ...slicedRows].join('\n');

    // Calculate the new byte offset for the next request
    const newByteOffset = byteOffset + chunk.length;

    const hasMore = newByteOffset < totalSize;

    res.status(200).json({
      data: csvChunk,
      totalCount: totalSize,
      hasMore,
      nextOffset: newByteOffset // Send this back to the client for the next request
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}