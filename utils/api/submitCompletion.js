const submitCompletion = async (data) => {
  try {
    const response = await fetch('/api/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw responseData.error
    }

    return responseData
  } catch (error) {
    throw error
  }
}

export default submitCompletion
