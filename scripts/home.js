const currentUser = JSON.parse(localStorage.getItem('currentUser'))
if (!currentUser || !currentUser?.isLoggedIn) {
    location.href = 'login.html'
}
document.body.classList.remove('hidden')


const btn = document.querySelector('.create')
const blackdrop = document.querySelector('div:first-of-type')
const popUp = document.querySelector('.pop-up')
const todoEl = popUp.querySelector('input')
const addBtn = popUp.querySelector('.add')
const editBtn = popUp.querySelector('.edit')
const logoutBtn = document.querySelector('.logout')
const innerContainers = document.querySelectorAll('.inner-container')

const allTodos = JSON.parse(localStorage.getItem('todo')) || []
const usertodos = allTodos?.find(user => user.id === currentUser.id)
usertodos?.todos?.forEach(element => {
    renderToDo(element)
});


function toggle() {
    blackdrop.classList.toggle('blackdrop')
    popUp.classList.toggle('visible')

}

function getTodo() {
    const todo = todoEl.value.trim()
    if (!todo) {
        return
    }
    const todoObj = {
        id: Date.now(),
        todo,
        status: 'inQueue',
    }
    const userTodosExist = allTodos.find(user => user.id === currentUser.id)

    if (userTodosExist) {
        userTodosExist.todos.push(todoObj)
    } else {
        allTodos.push({
            id: currentUser.id,
            todos: [todoObj]
        })
    }
    localStorage.setItem('todo', JSON.stringify(allTodos))
    todoEl.value = ''
    toggle()
    renderToDo(todoObj)
    location.reload()
}

function handleDrag(e) {
    e.dataTransfer.setData('text/plain', e.target.id)
    console.log(this.id)
    console.log(this)
    setTimeout(() => {
        this.style.display = 'none'
    }, 0)

}

function renderToDo(todo) {
    const todoItems = document.querySelector(`.${todo.status}`)
    const li = document.createElement('li')
    li.setAttribute('draggable', true)
    li.setAttribute('id', `${todo.id}`)
    li.innerHTML = `
        ${todo.todo} <span><i class="bi bi-pencil-square hover"></i> <i class="bi bi-trash-fill hover"></i></span>
    `
    li.addEventListener('dragstart', handleDrag)
    li.addEventListener('dragend', function () {
        this.style.display = 'flex'
    })
    const pencilBtn = li.querySelector('.bi-pencil-square')
    const deleteBtn = li.querySelector('.bi-trash-fill')
    pencilBtn.addEventListener('click', (e) => {
        toggle()
        addBtn.classList.add('hidden')
        editBtn.classList.remove('hidden')
        todoEl.value = todo.todo
        editBtn.setAttribute('data-id', todo.id)
    })

    deleteBtn.addEventListener('click', (e) => {
        li.remove()
        const index = usertodos.todos.findIndex(el => el.id === todo.id)
        if (index > -1) {
            usertodos.todos.splice(index, 1)
        }
        localStorage.setItem('todo', JSON.stringify(allTodos))
    })
    todoItems.appendChild(li)
}

function handleDropEvent(e) {
    e.preventDefault()
    this.classList.remove('dragging')
    const id = e.dataTransfer.getData('text')
    const drag = document.getElementById(`${id}`)
    if (!drag) {
        return
    }
    const ul = this.querySelector('ul')
    if (!ul) {
        return
    }
    ul.appendChild(drag)
    console.log(usertodos.todos)
    const todo = usertodos.todos.find(todo => todo.id === Number(id))
    todo.status = this.id
    localStorage.setItem('todo', JSON.stringify(allTodos))
}

innerContainers.forEach(innerContainer => {
    innerContainer.addEventListener('dragover', (e) => e.preventDefault())
    innerContainer.addEventListener('drop', handleDropEvent)
    innerContainer.addEventListener('dragenter', (e) => {
        innerContainer.classList.add('dragging')
    })
    innerContainer.addEventListener('dragleave', (e) => {
        innerContainer.classList.remove('dragging')
    })
})

editBtn.addEventListener('click', (e) => {
    const updatedText = todoEl.value
    if (!updatedText) {
        return
    }
    const li = document.getElementById(editBtn.dataset.id)
    li.innerText = updatedText
    usertodos.todos.find(user => user.id === Number(editBtn.dataset.id)).todo = updatedText
    localStorage.setItem('todo', JSON.stringify(allTodos))

    toggle()
    editBtn.removeAttribute('data-id')
    editBtn.classList.add('hidden')
    addBtn.classList.remove('hidden')
    console.dir(li.innerText)
})

btn.addEventListener('click', toggle)
blackdrop.addEventListener('click', toggle)
addBtn.addEventListener('click', getTodo)
logoutBtn.addEventListener('click', (e) => {
    currentUser.isLoggedIn = false
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    location.reload()
})