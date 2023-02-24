import getOpenAIInstance from '@/utils/api/getOpenAIInstance'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const {
      text,
      options
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
    });

    res.status(200).json({
      result: response.data
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Failed to generate completion',
      error
    })
  }
}
