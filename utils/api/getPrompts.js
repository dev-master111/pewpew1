const getPrompts = async () => {
  try {
    const response = await fetch('/api/prompts')
    const responseData = await response.json()

    return responseData
  } catch (error) {
    throw error
  }
}

export default getPrompts
