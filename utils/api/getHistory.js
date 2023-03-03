const getHistory = async (selectedPrompt) => {
  try {
    const response = await fetch(`/api/history?prompt=${selectedPrompt}`)
    const responseData = await response.json()

    if (!response.ok) {
      throw responseData.error
    }

    return responseData
  } catch (error) {
    throw error
  }
}

export default getHistory
