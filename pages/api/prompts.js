import moment from 'moment'
import { MongoClient, ObjectId } from 'mongodb'

const url = process.env.MONDODB_URI
const client = new MongoClient(url)
const dbName = process.env.DB_DATABASE

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT') {
    res.setHeader('Allow', 'GET', 'POST', 'PUT')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('prompts')

    const { email: userEmail } = req.query

    if (req.method === 'POST') {
      const {
        name,
        description,
        text,
        email
      } = req.body

      await collection.insertOne({
        created_at: moment().format(),
        name,
        description,
        text,
        email
      })
    }

    if (req.method === 'PUT') {
      const {
        id,
        name,
        description,
        text,
        email
      } = req.body

      await collection.updateOne(
        { _id : new ObjectId(id) },
        {
          $set: {
            updated_at: moment().format(),
            name,
            description,
            text,
            email
          }
        }
      )
    }

    const findResult = await collection.find({ email: userEmail }).sort({ name: 1 }).toArray()
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
