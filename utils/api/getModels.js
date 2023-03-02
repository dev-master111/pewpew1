const getModels = async () => {
  try {
    const response = await fetch('/api/models')
    const responseData = await response.json()

    return responseData
  } catch (error) {
    throw error
  }
}

export default getModels
