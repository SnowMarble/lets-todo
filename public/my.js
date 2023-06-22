"use strict"

const logoutBtn = document.getElementById('logout')
const name = document.getElementById('name')
const email = document.getElementById('email')
const total = document.getElementById('total')
const today = document.getElementById('today')
const rank = document.getElementById('rank')

;(async () => {
  const accessToken = localStorage.getItem('accessToken')
  
  if (!accessToken) {
    window.location.href = '/login'
  }

  const res = await fetch('/api/user', {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await res.json()

  name.innerText = data.user.name
  email.innerText = data.user.email

  total.innerText = data.todo.total
  today.innerText = data.todo.today
  rank.innerText = data.todo.rank
})()

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('accessToken')
  window.location.href = '/login'
})
