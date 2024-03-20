import { execFile } from 'child_process';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;

    execFile('python3', ['pages/api/pythonScript.py', query], (error, stdout, stderr) => {
      if (error) {
        console.error(`execFile error: ${error}`);
        return res.status(500).send('Error executing query');
      }
      res.status(200).json({ result: stdout.trim() });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
