async function run() {
  const payload = {
    answers: Array(55).fill(4),
    profile: {
      birthdate: '1990-01-01',
      gender: 'female',
      email: 'anon-test@example.com'
    },
    engineVersion: 'imcore-1.0.0'
  }

  const response = await fetch('http://localhost:3000/api/test/analyze', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  const text = await response.text()
  console.log('Status:', response.status)
  console.log('Body:', text)
}

run().catch(err => {
  console.error('Error:', err)
  process.exitCode = 1
})

