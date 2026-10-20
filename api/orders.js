/**
 * YM BRANDS - Live Orders Serverless API for Vercel & MongoDB Atlas
 * Connects directly through Vercel's Edge/Serverless infrastructure
 * 100% accessible from all mobile carriers (Vodafone, WE, Orange, Etisalat) without ISP blocks.
 */
import dns from 'dns';
import { MongoClient } from 'mongodb';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore in restricted environments
}

const MONGODB_URI = (
  process.env.MONGODB_URI ||
  'mongodb+srv://yehiarashed2004_db_user:yehiaamin111@cluster0.bnlf753.mongodb.net/?appName=Cluster0'
).trim();

const DB_NAME = 'ym_brands';
const COLLECTION_NAME = 'orders';

let cachedClient = null;

async function getDatabase() {
  if (cachedClient) {
    return cachedClient.db(DB_NAME);
  }
  const client = new MongoClient(MONGODB_URI, {
    tls: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 15000,
    retryWrites: true,
  });
  await client.connect();
  cachedClient = client;
  return client.db(DB_NAME);
}

export default async function handler(req, res) {
  // Universal CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    // 1. GET: Fetch all orders sorted by date
    if (req.method === 'GET') {
      const docs = await collection.find({}).sort({ date: -1 }).toArray();
      const cleanOrders = docs.map(({ _id, ...rest }) => rest);
      return res.status(200).json(cleanOrders);
    }

    // 2. POST: Add new order or Purge
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON payload' });
        }
      }

      // Purge action
      if (body && (body.action === 'purge' || body.purge === true)) {
        await collection.deleteMany({});
        return res.status(200).json({ success: true, message: 'All orders purged from MongoDB Atlas' });
      }

      if (body && body.id) {
        const { _id, ...cleanOrder } = body;
        await collection.updateOne(
          { id: String(cleanOrder.id) },
          { $set: cleanOrder },
          { upsert: true }
        );
        return res.status(200).json({ success: true, order: cleanOrder });
      }

      return res.status(400).json({ error: 'Missing order data' });
    }

    // 3. PUT: Update order status
    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON payload' });
        }
      }

      if (body && body.id && body.status) {
        await collection.updateOne(
          { id: String(body.id) },
          { $set: { status: body.status, updated_at: new Date().toISOString() } }
        );
        return res.status(200).json({ success: true, id: body.id, status: body.status });
      }
      return res.status(400).json({ error: 'Missing order id or status' });
    }

    // 4. DELETE: Delete an order by ID
    if (req.method === 'DELETE') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const idParam = url.searchParams.get('id');

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          // ignore
        }
      }

      const targetId = idParam || (body && body.id);
      if (!targetId) {
        return res.status(400).json({ error: 'Missing order ID in query parameter or body' });
      }

      await collection.deleteOne({ id: String(targetId) });
      return res.status(200).json({ success: true, id: String(targetId) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/orders error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
