

const currentUser = JSON.parse(localStorage.getItem('currentUser'))
if (!currentUser || !currentUser?.isLoggedIn) {
    document.body.innerHTML = 'loading...'
    location.href = 'login.html'
}
document.body.classList.remove('hidden')

import { nav } from "./nav.js";
document.body.insertAdjacentElement('afterbegin', nav)

const btns = document.querySelectorAll('.create')
const blackdrop = document.querySelector('.blackdrop')
const popUp = document.querySelector('.pop-up')
const todoEl = popUp.querySelector('input')
const addBtn = popUp.querySelector('.add')
const subBtn = popUp.querySelector('.sub')
const logoutBtn = document.querySelector('.logout')
const innerContainers = document.querySelectorAll('.inner-container')

let draggedEleId = null

const allTodos = JSON.parse(localStorage.getItem('todo')) || []
const usertodos = allTodos?.find(user => user.id === currentUser.id)
usertodos?.todos?.forEach(element => {
    renderToDo(element)
    element.subTask.forEach(subtask => {
        renderSubTask(element.id, subtask.id, subtask.text, subtask.checked)
        const div = document.getElementById(`subtask-${subtask.id}`)
        div.addEventListener('click', (e) => {
            e.stopPropagation()
            const checkbox = div.querySelector("input[type='checkbox']")
            if (e.target.tagName === 'INPUT') {
                subtask.checked = checkbox.checked
                localStorage.setItem('todo', JSON.stringify(allTodos))
                return
            }
        })
    })
});

export function toggle() {
    blackdrop.classList.toggle('hidden')
}

export function removeScrolling() {
    document.body.style.overflow = 'hidden'
}

export function addScrolling() {
    document.body.style.overflow = ''
}

function openPopUp() {
    popUp.classList.remove('hidden')
    addBtn.classList.remove('hidden')
    subBtn.classList.add('hidden')
    todoEl.placeholder = 'Add your todo task'
    popUp.querySelector('h1').textContent = 'Add your to do task'
    todoEl.value = ''
    const parent = this.parentElement
    addBtn.dataset.status = parent.id
    toggle()
    removeScrolling()
}

function getTodo() {
    const todo = todoEl.value.trim()
    if (!todo) {
        return
    }
    const todoObj = {
        id: Date.now(),
        todo,
        status: this.dataset.status,
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
    popUp.classList.add('hidden')
    location.reload()
}

function handleDrag(e) {
    e.dataTransfer.setData('text/plain', this.id)
    setTimeout(() => {
        this.style.display = 'none'
    }, 0)
    draggedEleId = this.id
}

function addSubTask(id) {
    setTimeout(() => {
        toggle()
        removeScrolling()
    }, 0)
    popUp.classList.remove('hidden')
    popUp.querySelector('h1').textContent = 'Add sub task'
    addBtn.classList.add('hidden')
    subBtn.classList.remove('hidden')
    todoEl.placeholder = 'Add sub task'
    subBtn.dataset.id = id
    todoEl.value = ''
}

function handleSubtaskvisibility(e) {
    const id = this.dataset.id
    this.classList.toggle('rotate')
    const todo = usertodos?.todos?.find(todo => todo.id === Number(id))
    const subtasks = todo.subTask
    if (subtasks) {
        subtasks.forEach(subTask => {
            const el = document.getElementById(`subtask-${subTask.id}`)
            el.classList.toggle('animation-height')
        })
    }
}

function deleteSubtask() {
    const subTaskEl = document.getElementById(`subtask-${this.dataset.subId}`)
    subTaskEl.remove()
    const todo = allTodos[0].todos.find(todo => todo.id === Number(this.dataset.parentId))
    const subTaskIndex = todo.subTask.findIndex(sub => sub.id === Number(this.dataset.subId))
    todo.subTask.splice(subTaskIndex, 1)
    localStorage.setItem('todo', JSON.stringify(allTodos))
}

function renderSubTask(parentid, id, subTask, isChecked) {
    const template = document.querySelector('template')
    const cloned = template.content.cloneNode(true)
    if (!subTask) {
        return
    }
    const label = cloned.querySelector('label')
    const checkbox = cloned.querySelector('input')
    const deleteBtn = cloned.querySelector('.bi-trash-fill')
    label.textContent = subTask
    label.setAttribute('for', `${id}`)
    checkbox.id = id
    checkbox.checked = isChecked
    const div = document.createElement('div')
    div.setAttribute('class', 'subtask animation-height')
    div.setAttribute('id', `subtask-${id}`)
    deleteBtn.dataset.subId = id
    deleteBtn.dataset.parentId = parentid
    div.append(checkbox)
    div.append(label)
    div.append(deleteBtn)
    deleteBtn.addEventListener('click', deleteSubtask)
    const li = document.getElementById(`${parentid}`)
    li.append(div)
}

function handelSubTask() {
    const id = Date.now()
    const subTask = todoEl.value.trim()
    toggle()
    addScrolling()
    this.classList.add('hidden')
    addBtn.classList.remove('hidden')
    popUp.classList.add('hidden')
    const todo = usertodos?.todos.find(todo => todo.id === Number(this.dataset.id))
    todo.subTask.push({
        id,
        text: subTask,
        checked: false
    })
    renderSubTask(this.dataset.id, id, subTask, false)
    localStorage.setItem('todo', JSON.stringify(allTodos))
    location.reload()
}

function handelEditPopup(e) {
    e.stopPropagation()
    const id = this.dataset.id
    const todo = usertodos?.todos?.find(todo => todo.id === Number(id))
    const text = todo.todo
    const li = document.getElementById(`${id}`)
    li.draggable = false
    blackdrop.classList.remove('hidden')
    removeScrolling()
    const parent = this.parentElement
    const nextSibling = parent.nextElementSibling
    const rect = this.getBoundingClientRect()
    const x = rect.left
    const y = rect.top
    const input = nextSibling.querySelector('textarea')
    const subtaskBtn = nextSibling.querySelector('.add-subtask')
    input.value = text
    input.focus()
    nextSibling.style.top = `${y}px`
    nextSibling.style.left = `${x - 300}px`
    nextSibling.classList.remove('animation')

    document.removeEventListener('click', handleNextClick)
    function handleNextClick(ev) {
        if (ev.target === subtaskBtn) {
            return
        } else if (ev.target !== input) {
            const updatedText = input.value.trim()
            if (updatedText && todo.todo !== updatedText) {
                li.querySelector('p').querySelector('i').nextSibling.textContent = updatedText
                todo.todo = updatedText
                localStorage.setItem('todo', JSON.stringify(allTodos))
            }
            li.draggable = true
            blackdrop.classList.add('hidden')
            addScrolling()
            nextSibling.classList.add('animation');
            document.removeEventListener('click', handleNextClick)
        }
    }
    setTimeout(() => {
        document.addEventListener('click', handleNextClick)
    }, 0);
}

subBtn.addEventListener('click', handelSubTask)

function renderToDo(todo) {
    const todoItems = document.querySelector(`.${todo.status}`)
    const li = document.createElement('li')
    li.draggable = true
    li.setAttribute('id', `${todo.id}`)
    li.dataset.status = todo.status
    li.dataset.text = todo.todo
    li.innerHTML = `
        <div class='task-heading'>
            <p><i class="bi bi-caret-down-fill"></i> ${li.dataset.text}</p> <span><i class="bi bi-pencil-square pencil"></i> </span>
            <div class='edit-pop-up animation'>
                <div class='edit-input'>
                    <textarea></textarea>
                </div>
                <div class='edit-buttons'>
                    <a class='delete-todo'><i class="bi bi-trash-fill hover">  Delete</i></a>
                    <a class='add-subtask'><i class="bi bi-plus-lg hover" title='click to add sub task'>Sub task</i></a>
                </div>     
            </div>
        </div>
    `

    li.addEventListener('dragstart', handleDrag)
    li.addEventListener('dragend', function () {
        this.style.display = 'block'
    })

    const pencil = li.querySelector('.pencil')
    pencil.dataset.id = todo.id
    const deleteBtn = li.querySelector('.delete-todo')
    const subTask = li.querySelector('.add-subtask')
    const dropDown = li.querySelector('.bi-caret-down-fill')
    dropDown.dataset.id = todo.id
    pencil.addEventListener('click', handelEditPopup)
    dropDown.addEventListener('click', handleSubtaskvisibility)

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
    const drag = document.getElementById(`${id}`)

    if (!drag) {
        return
    }

    drag.dataset.status = this?.dataset.status
    this.appendChild(drag)
    const todo = usertodos?.todos?.find(todo => todo.id === Number(id))
    todo.time = Date.now()
    todo.status = this.dataset.status
    usertodos.todos.sort((a, b) => { return a.time - b.time })
    localStorage.setItem('todo', JSON.stringify(allTodos))
}


innerContainers.forEach(innerContainer => {
    const ul = innerContainer.querySelector('ul')
    ul.dataset.status = innerContainer.id

    ul.addEventListener('dragover', function (e) {
        e.preventDefault()
        const li = document.getElementById(`${draggedEleId}`)
        if ((li.dataset.status === 'inQueue' && ul.dataset.status === 'completed') || (li.dataset.status === 'completed' && ul.dataset.status === 'inQueue')) {
            e.dataTransfer.dropEffect = 'none';
            e.currentTarget.style.cursor = 'not-allowed';
        } else {
            e.dataTransfer.dropEffect = 'move';
            e.currentTarget.style.cursor = 'pointer';
        }
    })

    ul.addEventListener('drop', handleDropEvent)

    ul.addEventListener('dragenter', function (e) {
        const li = document.getElementById(`${draggedEleId}`)
        if ((li.dataset.status === 'inQueue' && ul.dataset.status === 'completed') || (li.dataset.status === 'completed' && ul.dataset.status === 'inQueue')) {
            return
        } else if (ul.contains(e.target)) {
            e.currentTarget.classList.add('dragging')
        }
    })
    ul.addEventListener('dragleave', function (e) {

        if (e.relatedTarget?.closest('ul') !== ul) {
            e.currentTarget.classList.remove('dragging')
        }
    })
})

btns.forEach(btn => {
    btn.addEventListener('click', openPopUp)
})
blackdrop.addEventListener('click', () => {
    toggle()
    addScrolling()
    if (!popUp.classList.contains('hidden')) {
        popUp.classList.add('hidden')
    }
})
addBtn.addEventListener('click', getTodo)
logoutBtn.addEventListener('click', (e) => {
    currentUser.isLoggedIn = false
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    location.reload()
})