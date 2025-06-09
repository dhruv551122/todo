import { showErrorUserProfile, removeErrorUserProfile } from './showError.js'
import { checkUserEmail, checkUserPassword, checkUserUsername } from './checkUserData.js'

const currentUser = JSON.parse(localStorage.getItem('currentUser'))
console.log(currentUser.username)
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
const profileIcon = document.querySelector('.bi-person-circle')
const profileTab = document.querySelector('.user-profile')
const profileFullname = document.querySelector('.profile-fullname')
const profileUsername = document.querySelector('.profile-username')
const profileEmail = document.querySelector('.user-email')
const profiledob = document.querySelector('.user-dob')
const userDetails = document.querySelectorAll('.user-detail')
const saveBtns = document.querySelectorAll('.save-button')

const darggedId = null

const users = JSON.parse(localStorage.getItem('users'))
const allTodos = JSON.parse(localStorage.getItem('todo')) || []
const usertodos = allTodos?.find(user => user.id === currentUser.id)
usertodos?.todos?.forEach(element => {
    renderToDo(element)
    element.subTask.forEach(subtask => {
        renderSubTask(element.id, subtask.id, subtask.text, subtask.checked)
        const div = document.getElementById(`subtask-${subtask.id}`)
        div.addEventListener('click', (e) => {
            const checkbox = div.querySelector("input[type='checkbox']")
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                subtask.checked = checkbox.checked
                localStorage.setItem('todo', JSON.stringify(allTodos))
                return
            }
            checkbox.checked = !checkbox.checked
            subtask.checked = checkbox.checked
            localStorage.setItem('todo', JSON.stringify(allTodos))
        })
    })
});

function isMobileDevice() {
    console.log('mobile')
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0

}


profileFullname.textContent = `${currentUser.firstName} ${currentUser.lastName}`
profileUsername.textContent = `@${currentUser.username}`
// profileEmail.querySelector('input').value = `${currentUser.email}`
// profiledob.querySelector('input').value = `${currentUser.dob}`
userDetails.forEach(userDetail => {
    const userDetailEditBtn = userDetail.querySelector('.bi-pencil-square')
    const input = userDetail.querySelector('input')
    const userKey = input.id.split('-')[1]
    input.value = currentUser[userKey]
    userDetailEditBtn.addEventListener('click', editUserDetailHandler)
})

saveBtns.forEach(saveBtn => {
    saveBtn.addEventListener('click', checkUserDetail)
})

function editUserDetailHandler() {
    const id = this.dataset.id
    const input = document.getElementById(`user-${id}`)
    const container = input.closest('.user-detail')
    const saveBtn = document.querySelector(`.${id}-save-btn`)
    const errorDiv = document.querySelector(`.error-${id}`)
    saveBtn.style.visibility = 'visible'
    input.removeAttribute('readonly')
    input.focus()
    container.style.border = '1px solid #174dca'
    document.removeEventListener('click', removeFocus)
    function removeFocus(e) {
        if (!container.contains(e.target) && e.target !== saveBtn) {
            saveBtn.style.visibility = 'hidden'
            input.setAttribute('readonly', 'true')
            input.closest('.user-detail').style.border = '1px solid transparent'
            document.removeEventListener('click', removeFocus)
            errorDiv.style.visibility = 'hidden'
            input.value = currentUser[id]
        }
    }

    setTimeout(() => document.addEventListener('click', removeFocus), 0)
}

function checkUserDetail() {
    const id = this.dataset.id
    const userDetail = document.querySelector(`.user-${id}`)
    const errorDiv = document.querySelector(`.error-${id}`)
    const input = document.getElementById(`user-${id}`)
    const inputValue = input.value.trim()

    if (id === 'email') {
        if (!checkUserEmail(inputValue, errorDiv, userDetail)) {
            return
        }
    }
    if (id === 'username') {
        if (!checkUserUsername(inputValue, errorDiv, userDetail)) {
            return
        }
    }
    saveUserDetail(id, inputValue)
    showSuccessMsg()
}

function saveUserDetail(id, inputValue) {
    const user = users.find(user => user.id === currentUser.id)
    user[id] = inputValue
    currentUser[id] = inputValue
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

function showSuccessMsg() {
    const successMsg = document.querySelector('.success-msg')
    successMsg.style.opacity = '0.8'
    setTimeout(() => successMsg.style.opacity = '0', 1000)
}

function toggle() {
    blackdrop.classList.toggle('hidden')
}

let hideTimeout;

profileIcon.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    profileTab.classList.remove('hidden');
    profileTab.classList.remove('hide');
    toggle();
});

profileIcon.addEventListener('mouseleave', () => {
    scheduleHide();
});

profileTab.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
});

profileTab.addEventListener('mouseleave', () => {
    scheduleHide();
});

function scheduleHide() {
    hideTimeout = setTimeout(() => {
        profileTab.classList.add('hide');
        toggle();
    }, 200);
}

profileTab.addEventListener('transitionend', () => {
    if (profileTab.classList.contains('hide')) {
        profileTab.classList.add('hidden');
    }
});

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
}


function getTodo() {
    const todo = todoEl.value.trim()
    if (!todo) {
        return
    }
    console.log(this.dataset.status)
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
    e.dataTransfer.setData('text/plain', e.target.id)
    setTimeout(() => {
        this.style.display = 'none'
    }, 0)
    console.log('yes')

}

function addSubTask(id) {
    setTimeout(() => {
        toggle()
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
    console.log(subtasks)
    if (subtasks) {
        subtasks.forEach(subTask => {
            const el = document.getElementById(`subtask-${subTask.id}`)
            console.log(el)
            el.classList.toggle('animation-height')
        })
    }
}

function renderSubTask(parentid, id, subTask, isChecked) {
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
    checkbox.checked = isChecked
    const div = document.createElement('div')
    div.setAttribute('class', 'subtask animation-height')
    div.setAttribute('id', `subtask-${id}`)
    div.append(checkbox)
    div.append(label)
    const li = document.getElementById(`${parentid}`)
    li.append(div)
}

function handelSubTask(e) {
    const id = Date.now()
    const subTask = todoEl.value.trim()
    toggle()
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
}

function handelEditPopup(e) {
    e.stopPropagation()
    const id = this.dataset.id
    const todo = usertodos?.todos?.find(todo => todo.id === Number(id))
    const text = todo.todo
    const li = document.getElementById(`${id}`)
    li.draggable = false
    console.log(window.innerWidth)
    blackdrop.classList.toggle('hidden')
    const parent = this.parentElement
    const nextSibling = parent.nextElementSibling
    const rect = this.getBoundingClientRect()
    const x = rect.left
    const y = rect.top
    const input = nextSibling.querySelector('textarea')
    const subtaskBtn = nextSibling.querySelector('.add-subtask')
    console.log(subtaskBtn)
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
                console.dir(li.querySelector('p'))
                li.querySelector('p').querySelector('i').nextSibling.textContent = updatedText
                // li.dataset.text = updatedText
                todo.todo = updatedText
                localStorage.setItem('todo', JSON.stringify(allTodos))
            }
            li.draggable = true
            blackdrop.classList.add('hidden');
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
    console.log(todo.status)
    const todoItems = document.querySelector(`.${todo.status}`)
    const li = document.createElement('li')
    li.draggable = true
    li.setAttribute('id', `${todo.id}`)
    li.dataset.text = todo.todo
    li.innerHTML = `
        <div class='task-heading'>
            <p><i class="bi bi-caret-down-fill"></i> ${li.dataset.text}</p> <span><i class="bi bi-pencil-square pencil"></i> </span>
            <div class='edit-pop-up animation'>
                <div class='edit-input'>
                    <textarea></textarea>
                </div>
                <div class='edit-buttons'>
                    <a class='delete-todo'><i class="bi bi-trash-fill hover ">  Delete</i></a>
                    <a class='add-subtask'><i class="bi bi-plus-lg hover" title='click to add sub task'>Sub task</i></a>
                </div>     
            </div>
        </div>
    `
    if (isMobileDevice()) {

        li.addEventListener('touchstart', handleDrag)
        li.addEventListener('touchend', function () {
            this.style.display = 'block'
        })
    } else {
        li.addEventListener('dragstart', handleDrag)
        li.addEventListener('dragend', function () {
            this.style.display = 'block'
        })
    }

    const pencil = li.querySelector('.pencil')
    pencil.dataset.id = todo.id
    const deleteBtn = li.querySelector('.delete-todo')
    const subTask = li.querySelector('.add-subtask')
    const dropDown = li.querySelector('.bi-caret-down-fill')
    dropDown.dataset.id = todo.id
    // dropDown.addEventListener('click', () => { })
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
    // console.log(id)
    const drag = document.getElementById(`${id}`)
    if (!drag) {
        return
    }
    this.appendChild(drag)
    // console.log(usertodos.todos)
    const todo = usertodos?.todos?.find(todo => todo.id === Number(id))
    todo.time = Date.now()
    todo.status = this.dataset.status
    usertodos.todos.sort((a, b) => { return a.time - b.time })
    // console.log(allTodos)
    localStorage.setItem('todo', JSON.stringify(allTodos))
}


innerContainers.forEach(innerContainer => {
    const ul = innerContainer.querySelector('ul')
    ul.dataset.status = innerContainer.id
    if (isMobileDevice()) {
        ul.addEventListener('touchmove', function (e) {
            e.preventDefault()

            const touch = e.touches[0]
            const target = document.elementFromPoint(touch.clientX, touch.clientY)
            const dropzone = target?.closest('ul')

            if (dropzone === ul) {
                ul.classList.add('dragging')
            } else {
                ul.classList.remove('dragging')
            }
        })

        ul.addEventListener('touchend', handleDropEvent)
    } else {
        ul.addEventListener('dragover', function (e) {
            e.preventDefault()
        })
        ul.addEventListener('drop', handleDropEvent)
        ul.addEventListener('dragenter', function (e) {
            if (ul.contains(e.target)) {
                e.currentTarget.classList.add('dragging')
            }
        })
        ul.addEventListener('dragleave', function (e) {
            if (e.relatedTarget.closest('ul') !== ul) {
                e.currentTarget.classList.remove('dragging')
            }
        })
    }

})

btns.forEach(btn => {
    btn.addEventListener('click', openPopUp)
})
blackdrop.addEventListener('click', () => {
    toggle()
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