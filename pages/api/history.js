import { MongoClient } from 'mongodb'

const url = process.env.MONDODB_URI
const client = new MongoClient(url)
const dbName = process.env.DB_DATABASE

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const { prompt } = req.query

    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('history')
    const findResult = await collection.find(prompt && prompt !== 'null' ? { prompt } : {}).sort({ created_at: -1 }).toArray()
    return res.status(200).json(findResult)
  } catch (error) {
    console.log('get history error:')
    console.log(error)

    return res.status(500).send({
      message: 'Failed to get hitory data',
      error
    })
  }
}
