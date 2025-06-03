import { showError } from "./showError.js"

const firstNameEl = document.querySelector('input[name="first-name"]')
const lastNameEl = document.querySelector('input[name="last-name"]')
const usernameEl = document.querySelector('input[name="username"]')
const emailEl = document.querySelector('input[name="email"]')
const dobEl = document.querySelector('input[name="date-of-birth"]')
const passwordEl = document.querySelector('input[name="password"]')
const cPasswordEl = document.querySelector('input[name="confirm-password"]')
const btn = document.querySelector('button')
const errorDiv = document.querySelector('.error')


const users = JSON.parse(localStorage.getItem('users')) || []

function storeDataToLocalStorage(e) {
    e.preventDefault()
    errorDiv.innerHTML = ''
    const firstName = firstNameEl.value.trim()
    const lastName = lastNameEl.value.trim()
    const username = usernameEl.value.trim()
    const email = emailEl.value.trim()
    const dob = dobEl.value.trim()
    const password = passwordEl.value.trim()
    const cPassword = cPasswordEl.value.trim()

    if (!firstName || !lastName || !username || !email || !dob || !password || !cPassword) {
        showError(errorDiv, 'All fields are required!')
        return
    }
    if (/[^a-zA-Z0-9_]/.test(username)) {
        showError(errorDiv, 'Characters, numbers and _ are only allowed for username field!')
        return
    }
    const usernameAlreadyExist = users.find(user => user.username === username)
    if (usernameAlreadyExist) {
        showError(errorDiv, 'User with same username already exists, please choose another username')
        return
    }
    if (username.length < 8) {
        showError(errorDiv, 'Username must be 8 character long!')
        return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(errorDiv, 'Please eneter valid email!')
        return
    }
    const emailAlreadyExist = users.find(user => user.email === email)
    if (emailAlreadyExist) {
        showError(errorDiv, 'Email already registered!')
        return
    }
    if (password !== cPassword) {
        showError(errorDiv, "Both password doesn't matching!")
        return
    }

    const user = {
        id: Date.now(),
        firstName,
        lastName,
        username,
        email,
        dob,
        password,
    }
    users.push(user)
    localStorage.setItem('users', JSON.stringify(users))
    console.log(users)
    firstNameEl.value = ''
    lastNameEl.value = ''
    usernameEl.value = ''
    emailEl.value = ''
    dobEl.value = ''
    passwordEl.value = ''
    cPasswordEl.value = ''
    document.body.innerHTML = 'loading...'
    location.href = 'login.html'
}

btn.addEventListener('click', storeDataToLocalStorage)