import moment from 'moment'
import { MongoClient } from 'mongodb'
import getOpenAIInstance from '@/utils/api/getOpenAIInstance'

const url = process.env.MONDODB_URI
const client = new MongoClient(url)
const dbName = process.env.DB_DATABASE

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const {
      text,
      prompt,
      options,
      email
    } = req.body

    const openai = getOpenAIInstance()

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      best_of: options.bestOf
    })

    if (response.data.choices && response.data.choices.length > 0){
      await client.connect()
      console.log('Connected successfully to server')
      const db = client.db(dbName)
      const collection = db.collection('history')
      await collection.insertOne({
        created_at: moment().format(),
        input_text: text,
        user: 'dev-master111',
        prompt,
        output_text: response.data.choices[0].text,
        email
      })

      await client.close()
    }

    return res.status(200).json(response.data)
  } catch (error) {
    console.log('Failed to generate completion:')
    console.log(error)

    return res.status(500).send({
      message: 'Failed to generate completion',
      error
    })
  }
}
