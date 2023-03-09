const getHistory = async (selectedPrompt) => {
  try {
    const userResponse = await fetch(`/api/auth/me`)
    const userInfo = await userResponse.json()
    const response = await fetch(`/api/history?prompt=${selectedPrompt}&&email=${userInfo.email}`)
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
