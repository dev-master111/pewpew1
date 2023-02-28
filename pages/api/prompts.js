import moment from 'moment'
import { MongoClient } from 'mongodb'

const url = process.env.MONDODB_URI;
const client = new MongoClient(url);
const dbName = process.env.DB_DATABASE;

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('prompts');

    if (req.method === 'POST') {
      const {
        name,
        description,
      } = req.body

      await collection.insertOne({
        created_at: moment().format(),
        name,
        description
      })
    }

    const findResult = await collection.find({}).sort({ name: 1 }).toArray();
    return res.status(200).json(findResult)
  } catch (error) {
    console.log('get prompts error:')
    console.log(error)

    return res.status(500).send({
      message: 'Failed to get hitory data',
      error
    })
  }
}
