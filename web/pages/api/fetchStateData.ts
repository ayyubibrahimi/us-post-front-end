import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

const CHUNK_SIZE = 100000 * 1024; // 100KB

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state, offset } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  const startOffset = offset ? parseInt(offset as string, 10) : 0;

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

    res.status(206).json({
      data: chunk,
      nextOffset: startOffset + chunk.length,
      hasMore: startOffset + chunk.length < totalSize
    });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}