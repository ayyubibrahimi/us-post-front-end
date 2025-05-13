import { getDownloadURL, ref } from "firebase/storage";
import type { NextApiRequest, NextApiResponse } from "next";
import { storage } from "../../utils/FirebaseConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { state } = req.query;

  if (!state || Array.isArray(state)) {
    return res
      .status(400)
      .json({ error: "State parameter is required and must be a string" });
  }

  try {
    const formattedState = state.toLowerCase().replace(/\s+/g, "-");
    const fileName = `${formattedState}-processed.csv`;
    const fileRef = ref(storage, fileName);

    const downloadUrl = await getDownloadURL(fileRef);

    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    res.status(500).json({ error: "Failed to generate download URL for CSV" });
  }
}
