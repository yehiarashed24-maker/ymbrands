/**
 * YM BRANDS - Live Products Serverless API for Vercel & MongoDB Atlas
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

const MONGODB_URI = (() => {
  const envUri = (process.env.MONGODB_URI || '').trim();
  if (envUri && !envUri.includes('bimlrnx')) {
    return envUri;
  }
  return 'mongodb+srv://yehiarashed2004_db_user:yehiaamin111@cluster0.bnlf753.mongodb.net/?appName=Cluster0';
})();

const DB_NAME = 'ym_brands';
const COLLECTION_NAME = 'products';

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

    // 1. GET: Fetch all products
    if (req.method === 'GET') {
      const docs = await collection.find({}).sort({ id: -1 }).toArray();
      const cleanProducts = docs.map(({ _id, ...rest }) => rest);
      return res.status(200).json(cleanProducts);
    }

    // 2. POST: Add or Replace or Purge
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON payload' });
        }
      }

      // Action: Purge all products
      if (body && (body.action === 'purge' || body.purge === true)) {
        await collection.deleteMany({});
        return res.status(200).json({ success: true, count: 0, message: 'All products purged from MongoDB Atlas' });
      }

      // Action: Bulk array import or seed
      if (Array.isArray(body)) {
        await collection.deleteMany({});
        if (body.length > 0) {
          const cleanDocs = body.map(({ _id, ...rest }) => rest);
          await collection.insertMany(cleanDocs);
        }
        return res.status(200).json({ success: true, count: body.length });
      }

      // Action: Single product add or upsert
      if (body && body.id) {
        const { _id, ...cleanProduct } = body;
        await collection.updateOne(
          { id: Number(cleanProduct.id) },
          { $set: cleanProduct },
          { upsert: true }
        );
        return res.status(200).json({ success: true, product: cleanProduct });
      }

      return res.status(400).json({ error: 'Invalid product payload' });
    }

    // 3. PUT: Update an existing product
    if (req.method === 'PUT') {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON payload' });
        }
      }

      if (body && body.id) {
        const { _id, ...cleanProduct } = body;
        await collection.updateOne(
          { id: Number(cleanProduct.id) },
          { $set: cleanProduct },
          { upsert: true }
        );
        return res.status(200).json({ success: true, product: cleanProduct });
      }
      return res.status(400).json({ error: 'Missing product id for update' });
    }

    // 4. DELETE: Delete a product by ID
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
        return res.status(400).json({ error: 'Missing product ID in query parameter or body' });
      }

      await collection.deleteOne({ id: Number(targetId) });
      return res.status(200).json({ success: true, id: Number(targetId) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /api/products error]:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
