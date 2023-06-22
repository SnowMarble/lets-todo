'use strict'

const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = form.email.value
  const password = form.password.value

  fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.error || data.status === 'error') {
        alert('로그인 실패')
      } else {
        localStorage.setItem('accessToken', data.accessToken)
        window.location.href = '/'
      }
    })
    .catch(alert)
})
