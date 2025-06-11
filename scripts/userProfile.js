import { showError, removeError, removeErrorProfile } from './showError.js'
import { checkUserEmail, checkUserPassword, checkUserUsername } from './checkUserData.js'
import { toggle, addScrolling, removeScrolling } from './home.js'

const profileIcon = document.querySelector('.bi-person-circle')
const profileTab = document.querySelector('.user-profile')
const profileFullname = document.querySelector('.profile-fullname')
const profileUsername = document.querySelector('.profile-username')
const userDetails = document.querySelectorAll('.user-detail')
const saveBtns = document.querySelectorAll('.save-button')
const changePass = document.querySelector('.change-password')
const editPassDiv = document.querySelector('.edit-password')
const passwordSaveBtn = document.querySelector('.password-change-btn')

const users = JSON.parse(localStorage.getItem('users'))
const currentUser = JSON.parse(localStorage.getItem('currentUser'))

profileIcon.addEventListener('click', (e) => {
    e.stopPropagation()
    profileTab.classList.remove('hidden');
    profileTab.classList.remove('hide');
    toggle();
    removeScrolling()
});

let mouseDownInside = null
document.addEventListener('mousedown', e => {
    mouseDownInside = profileTab.contains(e.target) || profileIcon.contains(e.target);
});

document.addEventListener('click', handelProfileVisibility)

function handelProfileVisibility(e) {
    if (!profileTab.classList.contains('hide')) {
        if (e.target.closest('.user-profile') !== profileTab && !mouseDownInside) {
            profileTab.classList.add('hide');
            addScrolling()
            if (changePass.classList.contains('hidden')) {
                editPassDiv.classList.add('hidden')
                changePass.classList.remove('hidden')
            }
        }
    }
}

profileFullname.textContent = `${currentUser.firstName} ${currentUser.lastName}`
profileUsername.textContent = `@${currentUser.username}`
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
    let isMouseDown = null
    saveBtn.style.visibility = 'visible'
    input.removeAttribute('readonly')
    input.focus()
    container.style.border = '1px solid #174dca'
    document.removeEventListener('click', removeFocus)
    function removeFocus(ev) {
        if (!isMouseDown) {
            if (!container.contains(ev.target) && ev.target !== saveBtn) {
                saveBtn.style.visibility = 'hidden'
                input.setAttribute('readonly', 'true')
                input.closest('.user-detail').style.border = '1px solid transparent'
                document.removeEventListener('click', removeFocus)
                errorDiv.style.visibility = 'hidden'
                input.value = currentUser[id]
            }
        }
    }
    function mouseDownHandel(evt) {
        isMouseDown = container.contains(evt.target)
    }
    setTimeout(() => {
        document.addEventListener('mousedown', mouseDownHandel)
    }, 0)
    setTimeout(() => document.addEventListener('click', removeFocus), 0)
}

function checkUserDetail() {
    const id = this.dataset.id
    const userDetail = document.querySelector(`.user-${id}`)
    const errorDiv = document.querySelector(`.error-${id}`)
    const input = document.getElementById(`user-${id}`)
    const inputValue = input.value.trim()
    if (!inputValue) {
        showError(errorDiv, userDetail, `*${id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()} is required`)
        return
    } else {
        removeErrorProfile(errorDiv, userDetail)
    }
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
    showSuccessMsg(`${id.charAt(0).toUpperCase() + id.slice(1).toLowerCase()} saved successfully`)
}

function saveUserDetail(id, inputValue) {
    const user = users.find(user => user.id === currentUser.id)
    user[id] = inputValue
    currentUser[id] = inputValue
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
}

function showSuccessMsg(str = 'Successfully saved') {
    const successMsg = document.querySelector('.success-msg')
    successMsg.textContent = str
    successMsg.style.opacity = '1'
    setTimeout(() => successMsg.style.opacity = '0', 1000)
}

changePass.addEventListener('click', () => {
    changePass.classList.add('hidden')
    editPassDiv.classList.remove('hidden')
})

passwordSaveBtn.addEventListener('click', () => {
    const passwordEl = document.getElementById('user-password')
    let password = passwordEl.value.trim()
    const cPasswordEl = document.getElementById('user-cPassword')
    const cPassword = cPasswordEl.value.trim()
    const passwordError = document.querySelector('.password-error')
    const cPasswordErorr = document.querySelector('.cPassword-error')
    if (!checkUserPassword(password, cPassword, passwordError, passwordEl, cPasswordErorr, cPasswordEl)) {
        return
    }
    if (currentUser.password === password) {
        showSuccessMsg('Entered password is same as previous password')
        return
    }
    editPassDiv.classList.add('hidden')
    changePass.classList.remove('hidden')
    currentUser.password = password
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    showSuccessMsg()
    password = null
})

