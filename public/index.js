'use scrict'

const accessToken = localStorage.getItem('accessToken')

if (!accessToken) {
  window.location.href = '/login'
}

const board = document.getElementById('board')
const addBtn = document.getElementById('add')

const dateField = document.getElementById('date')
const year = document.getElementById('year')
const month = document.getElementById('month')
const day = document.getElementById('day')

const date = new Date()
dateField.innerText = date.getDate()
year.innerText = date.getFullYear()
month.innerText = date.toLocaleString('en-us', { month: 'short' })
day.innerText = date.toLocaleString('en-us', { weekday: 'long' })


addBtn.addEventListener('click', async () => {
  const title = prompt('Enter your todo')
  if (!title) return

  const res = await fetch('/api/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title }),
  })

  const data = await res.json()

  addTodo(data.id, data.title)
})

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('done')) {
    const target = e.target.parentNode
    target.classList.toggle('done')

    const todoId = target.getAttribute('todo')
    const isDone = target.classList.contains('done')
    fetch('/api/todo/' + todoId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ completed: isDone }),
    })
  }

  else if (e.target.classList.contains('edit')) {
    const target = e.target.parentNode
    const todoId = target.getAttribute('todo')
    const title = prompt('Enter your todo', target.querySelector('p').innerText)
    if (!title) return

    target.querySelector('p').innerText = title
    fetch('/api/todo/' + todoId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title }),
    })
  }

  else if (e.target.classList.contains('remove')) {
    if(!confirm('Are you sure?')) {
      return
    }
    const target = e.target.parentNode
    const todoId = target.getAttribute('todo')
    fetch('/api/todo/' + todoId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    target.remove()
  }

})
;(async () => {
  const todos = await getTodayTodo()
  todos.forEach((todo) => {
    addTodo(todo.id, todo.title, todo.completed)
  })

  // eslint-disable-next-line no-undef
  const source = new EventSource('/api/todo/global')

  source.addEventListener('message', (message) => {
    console.log(message.data)
    // eslint-disable-next-line no-undef
    Toastify({
      text: `${message.data} completed task!`,
    }).showToast()
  })
})()

function addTodo(id, title, isDone = false) {
  board.innerHTML += `
    <div class="group flex w-full items-center justify-between font-light ${
      isDone ? 'done' : ''
    }" todo="${id}">
      <div class="flex flex-row grow">
        <img src="/public/img/edit.svg" alt="edit" class="edit w-4 mr-1 opacity-0 group-hover:opacity-100 cursor-pointer">
        <p class="text-base group-[.done]:text-slate-300">${title}</p>
      </div>
      <div class="done rounded-full w-5 h-5 border-2 border-slate-500 cursor-pointer group-[.done]:border-green-500"></div>
      <img src="/public/img/remove.svg" alt="remove" class="remove w-5 h-5 ml-1 opacity-0 group-hover:opacity-100 cursor-pointer">
    </div>
  `
}

async function getTodayTodo() {
  const res = await fetch('/api/todo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await res.json()
}
