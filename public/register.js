'use scrict'

const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = form.email.value
  const name = form.name.value
  const password = form.password.value

  const res = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, password }),
  })

  const data = await res.json()

  if (data.error) {
    return alert(data.error)
  }

  window.location.href = '/login'
})
