const getHistory = async (selectedPrompt) => {
  try {
    const response = await fetch(`/api/history?prompt=${selectedPrompt}`)
    const responseData = await response.json()

    return responseData
  } catch (error) {
    throw error
  }
}

export default getHistory