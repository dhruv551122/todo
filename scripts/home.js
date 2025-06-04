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
const subBtn = popUp.querySelector('.sub')
const logoutBtn = document.querySelector('.logout')
const innerContainers = document.querySelectorAll('.inner-container')
const popUpSub = document.querySelector('.pop-up-subtask')

const allTodos = JSON.parse(localStorage.getItem('todo')) || []
const usertodos = allTodos?.find(user => user.id === currentUser.id)
usertodos?.todos?.forEach(element => {
    renderToDo(element)
    element.subTask.forEach(subtask => {
        renderSubTask(element.id, subtask.id, subtask.text)
    })

});


function toggle() {
    blackdrop.classList.toggle('hidden')
    popUp.classList.toggle('hidden')

}

function openPopUp() {
    editBtn.classList.add('hidden')
    addBtn.classList.remove('hidden')
    subBtn.classList.add('hidden')
    todoEl.placeholder = 'Add your todo task'
    popUp.querySelector('h1').textContent = 'Add your to do task'
    todoEl.value = ''
    toggle()
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
        subTask: []
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
    setTimeout(() => {
        this.style.display = 'none'
    }, 0)
}

function addSubTask(id) {
    toggle()
    popUp.querySelector('h1').textContent = 'Add sub task'
    editBtn.classList.add('hidden')
    addBtn.classList.add('hidden')
    subBtn.classList.remove('hidden')
    todoEl.placeholder = 'Add sub task'
    subBtn.dataset.id = id
    todoEl.value = ''
}

function renderSubTask(parentid, id, subTask) {
    const template = document.querySelector('template')
    const cloned = template.content.cloneNode(true)
    if (!subTask) {
        return
    }
    const label = cloned.querySelector('label')
    const checkbox = cloned.querySelector('input')
    label.textContent = subTask
    label.setAttribute('for', `${id}`)
    checkbox.id = id
    const div = document.createElement('div')
    div.setAttribute('class', 'subtask')
    div.setAttribute('id', `subtask-${id}`)
    div.append(checkbox)
    div.append(label)
    const li = document.getElementById(`${parentid}`)
    console.log(li)
    li.append(div)
}

function handelSubTask(e) {
    const id = Date.now()
    const subTask = todoEl.value.trim()
    toggle()
    this.classList.add('hidden')
    addBtn.classList.remove('hidden')
    const todo = usertodos?.todos.find(todo => todo.id === Number(this.dataset.id))
    todo.subTask.push({
        id,
        text: subTask,
        checked: false
    })
    renderSubTask(this.dataset.id, id, subTask)
    localStorage.setItem('todo', JSON.stringify(allTodos))
}

subBtn.addEventListener('click', handelSubTask)

function renderToDo(todo) {
    const todoItems = document.querySelector(`.${todo.status}`)
    const li = document.createElement('li')
    li.setAttribute('draggable', true)
    li.setAttribute('id', `${todo.id}`)
    li.dataset.text = todo.todo
    li.innerHTML = `
        <div class='task-heading'>
            <p><i class="bi bi-caret-down-fill"></i> ${li.dataset.text}</p> <span><i class="bi bi-pencil-square hover"></i> <i class="bi bi-trash-fill hover"></i><i class="bi bi-plus-lg hover" title='click to add sub task'>Sub task</i></span>
        </div>
        
    `
    li.addEventListener('dragstart', handleDrag)
    li.addEventListener('dragend', function () {
        this.style.display = 'block'
    })
    const pencilBtn = li.querySelector('.bi-pencil-square')
    const deleteBtn = li.querySelector('.bi-trash-fill')
    const subTask = li.querySelector('.bi-plus-lg')
    const dropDown = document.querySelector('.bi-caret-down-fill')
    dropDown.addEventListener('click', () => { })
    pencilBtn.addEventListener('click', (e) => {
        toggle()
        addBtn.classList.add('hidden')
        subBtn.classList.add('hidden')
        editBtn.classList.remove('hidden')
        todoEl.value = todo.todo
        editBtn.setAttribute('data-id', todo.id)
        popUp.querySelector('h1').textContent = 'Edit your task heading'
    })

    deleteBtn.addEventListener('click', (e) => {
        li.remove()
        const index = usertodos.todos.findIndex(el => el.id === todo.id)
        if (index > -1) {
            usertodos.todos.splice(index, 1)
        }
        localStorage.setItem('todo', JSON.stringify(allTodos))
    })

    subTask.addEventListener('click', addSubTask.bind(null, todo.id))
    todoItems.appendChild(li)
}

function handleDropEvent(e) {
    e.preventDefault()
    this.classList.remove('dragging')
    const id = e.dataTransfer.getData('text')
    console.log(id)
    const drag = document.getElementById(`${id}`)
    if (!drag) {
        return
    }
    const ul = this.querySelector('ul')
    if (!ul) {
        return
    }
    ul.appendChild(drag)
    const todo = usertodos.todos.find(todo => todo.id === Number(id))
    todo.time = Date.now()
    todo.status = this.id
    usertodos.todos.sort((a, b) => { return a.time - b.time })
    console.log(allTodos)
    localStorage.setItem('todo', JSON.stringify(allTodos))
}


editBtn.addEventListener('click', (e) => {
    const updatedText = todoEl.value
    if (!updatedText) {
        return
    }
    const li = document.getElementById(editBtn.dataset.id)
    const p = li.querySelector('p')
    p.textContent = updatedText
    // li.dataset.text = updatedText
    // li.innerText = updatedText
    usertodos.todos.find(user => user.id === Number(editBtn.dataset.id)).todo = updatedText
    localStorage.setItem('todo', JSON.stringify(allTodos))
    toggle()
    editBtn.classList.add('hidden')
    addBtn.classList.remove('hidden')
    editBtn.removeAttribute('data-id')
    popUp.querySelector('h1').textContent = 'Add your to do task'

    // location.reload()

})

innerContainers.forEach(innerContainer => {
    innerContainer.addEventListener('dragover', function (e) {
        e.preventDefault()
    })
    innerContainer.addEventListener('drop', handleDropEvent)
    innerContainer.addEventListener('dragenter', function (e) {
        innerContainer.classList.add('dragging')
    })
    innerContainer.addEventListener('dragleave', function (e) {
        innerContainer.classList.remove('dragging')
    })
})

btn.addEventListener('click', openPopUp)
blackdrop.addEventListener('click', toggle)
addBtn.addEventListener('click', getTodo)
logoutBtn.addEventListener('click', (e) => {
    currentUser.isLoggedIn = false
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    location.reload()
})