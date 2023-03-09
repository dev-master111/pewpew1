const submitCompletion = async (data) => {
  try {
    const userResponse = await fetch(`/api/auth/me`)
    const userInfo = await userResponse.json()
    const response = await fetch('/api/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        email: userInfo.email
      })
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
