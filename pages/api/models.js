import getOpenAIInstance from '@/utils/api/getOpenAIInstance'

export default async function handler(req, res) {
  console.log('process.env.OPENAI_API_KEY______________')
  console.log(process.env.OPENAI_API_KEY)

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const openai = getOpenAIInstance()
    const response = await openai.listModels();

    res.status(200).json(response.data)
  } catch (error) {
    return res.status(500).send({
      message: 'Failed to get models',
      error
    })
  }
}
