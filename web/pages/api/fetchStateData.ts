import { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '../../utils/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { state } = req.query;
  
  if (!state || Array.isArray(state)) {
    return res.status(400).json({ error: 'State parameter is required and must be a string' });
  }

  try {
    const fileName = `${state.toLowerCase()}-processed.csv`;
    const fileRef = ref(storage, fileName);
    const fileURL = await getDownloadURL(fileRef);
    
    const response = await fetch(fileURL);
    const csvText = await response.text();

    res.status(200).json({ data: csvText });
  } catch (error) {
    console.error('Error fetching state data:', error);
    res.status(500).json({ error: 'Failed to fetch state data' });
  }
}