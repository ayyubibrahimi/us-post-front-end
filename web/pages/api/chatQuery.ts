
// pages/api/chatQuery.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { DataSource } from 'typeorm';
import { OpenAI } from '@langchain/openai';
import { SqlDatabase } from 'langchain/sql_db';
import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';

// Assuming environment variables are set for database connection details
const dataSource = new DataSource({
  type: "postgres",
  host: "aws-0-us-west-1.pooler.supabase.com",
  port: 5432,
  username: "postgres.cddinxyabdxbopcgdjpp", // This is your Supabase user
  password: "Thewhiteknight1!",
  database: "postgres",
  ssl: {
      rejectUnauthorized: false,
  },
});

// Initialize the DataSource only once to avoid repeated initializations
let dbInitialized = false;
async function ensureDbInitialized() {
    if (!dbInitialized) {
        await dataSource.initialize();
        dbInitialized = true;
    }
}

const runQuery = async (input: string) => {
    await ensureDbInitialized();
    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: dataSource,
    });
    const model = new OpenAI({ temperature: 0, maxRetries: 50, verbose: true });
    const toolkit = new SqlToolkit(db, model);
    const executor = createSqlAgent(model, toolkit);

    const result = await executor.invoke({ input });
    return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const input = req.body.input;
    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }
    try {
      const result = await runQuery(input);
      res.status(200).json({ result });
    } catch (error) {
      console.error("Error processing query:", error);
      res.status(500).json({ error: 'Error processing your query. Please try again later.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// history

// pages/api/chatQuery.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { DataSource } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
// import { OpenAI } from '@langchain/openai'; // Ensure you have installed @langchain/openai or an equivalent OpenAI package
// import { SqlDatabase } from 'langchain/sql_db';
// import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';


// // Initialize your database connection here
// // Replace placeholders with your actual Supabase Postgres credentials
// const dataSource = new DataSource({
//   type: "postgres",
//   host: "aws-0-us-west-1.pooler.supabase.com",
//   port: 5432,
//   username: "postgres.cddinxyabdxbopcgdjpp", // This is your Supabase user
//   password: "Thewhiteknight1!",
//   database: "postgres",
//   ssl: {
//       rejectUnauthorized: false,
//   },
// });


// let dbInitialized = false;
// async function ensureDbInitialized() {
//     if (!dbInitialized) {
//         await dataSource.initialize();
//         dbInitialized = true;
//     }
// }

// // Function to load conversation history for a given user
// async function loadConversationHistory(uid: string) {
//     await ensureDbInitialized();
//     const result = await dataSource.query(
//         `SELECT history FROM chat_history WHERE uid = $1`,
//         [uid]
//     );
//     return result.length ? result[0].history : [];
// }

// // Function to update conversation history for a given user
// async function updateConversationHistory(uid: string, history: any[]) {
//     await ensureDbInitialized();
//     await dataSource.query(
//         `INSERT INTO chat_history (uid, history) VALUES ($1, $2)
//         ON CONFLICT (uid) DO UPDATE SET history = $2`,
//         [uid, JSON.stringify(history)]
//     );
// }

// const runQuery = async (input: string, uid: string) => {
//   await ensureDbInitialized();
//   const db = await SqlDatabase.fromDataSourceParams({
//       appDataSource: dataSource,
//   });
//   const model = new OpenAI({ temperature: 0, maxRetries: 50, verbose: true });
//   const toolkit = new SqlToolkit(db, model);
//   const executor = createSqlAgent(model, toolkit);

//   // Load existing conversation history
//   const history = await loadConversationHistory(uid);

//   // Process the input with the existing history as context
//   // This example simply passes the input; adjust according to your needs
//   const result = await executor.invoke({ input, history });

//   // Update the conversation history with the new input and result
//   const updatedHistory = [...history, { input, output: result }];
//   await updateConversationHistory(uid, updatedHistory);

//   return result;
// };

// export default async function handler(
// req: NextApiRequest,
// res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//       const input = req.body.input;
//       let uid = req.body.uid;
//       if (!uid) {
//           // Generate a new UID if not provided and return it in the response for future requests
//           uid = uuidv4();
//       }
      
//       if (!input) {
//           return res.status(400).json({ error: 'Input is required' });
//       }
//       try {
//           const result = await runQuery(input, uid);
//           res.status(200).json({ result, uid }); // Include UID in the response for client-side tracking
//       } catch (error) {
//           console.error("Error processing query:", error);
//           res.status(500).json({ error: 'Error processing your query. Please try again later.' });
//       }
//   } else {
//       res.setHeader('Allow', ['POST']);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


