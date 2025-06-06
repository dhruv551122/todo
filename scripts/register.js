import { removeError, showError } from "./showError.js"

const firstNameEl = document.querySelector('input[name="first-name"]')
const lastNameEl = document.querySelector('input[name="last-name"]')
const usernameEl = document.querySelector('input[name="username"]')
const emailEl = document.querySelector('input[name="email"]')
const dobEl = document.querySelector('input[name="date-of-birth"]')
const passwordEl = document.querySelector('input[name="password"]')
const cPasswordEl = document.querySelector('input[name="confirm-password"]')
const btn = document.querySelector('button')
const errorDiv = document.querySelectorAll('.error-msg')


const users = JSON.parse(localStorage.getItem('users')) || []

function storeDataToLocalStorage(e) {
    e.preventDefault()
    const firstName = firstNameEl.value.trim()
    const lastName = lastNameEl.value.trim()
    const username = usernameEl.value.trim()
    const usernameError = usernameEl.nextElementSibling
    const email = emailEl.value.trim()
    const emailError = emailEl.nextElementSibling
    const dob = dobEl.value.trim()
    const password = passwordEl.value.trim()
    const passwordError = passwordEl.nextElementSibling
    const cPassword = cPasswordEl.value.trim()
    const cPasswordErorr = cPasswordEl.nextElementSibling

    const inputs = [firstName, lastName, username, email, dob, password, cPassword]

    if (inputs.some(input => !input)) {
        errorDiv.forEach(error => {
            const div = error.closest('.flex-inner')
            const input = div.querySelector('input')
            if (!input.value.trim()) {
                const text = div.querySelector('label').textContent
                showError(error, input, `*${text} is required`)
                return
            } else {
                removeError(error, input)
            }
        })
        return
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailError, emailEl, '*Please eneter valid email!')
        return
    } else {
        removeError(emailError, emailEl)
    }
    const emailAlreadyExist = users.find(user => user.email === email)
    if (emailAlreadyExist) {
        showError(emailError, emailEl, '*Email already registered!')
        return
    } else {
        removeError(emailError, emailEl)
    }
    if (/[^a-zA-Z0-9_]/.test(username)) {
        showError(usernameError, usernameEl, '*Characters, numbers and _ are only allowed for username field!')
        return
    } else {
        removeError(usernameError, usernameEl)
    }
    const usernameAlreadyExist = users.find(user => user.username === username)
    if (usernameAlreadyExist) {
        showError(usernameError, usernameEl, '*User with same username already exists, please choose another username')
        return
    } else {
        removeError(usernameError, usernameEl)
    }
    if (username.length < 8) {
        showError(usernameError, usernameEl, '*Username must be 8 character long!')
        return
    } else {
        removeError(usernameError, usernameEl)
    }
    if (password !== cPassword) {
        showError(passwordError, passwordEl, "*Both password doesn't matching!")
        showError(cPasswordErorr, cPasswordEl, "*Both password doesn't matching!")
        return
    } else {
        removeError(passwordError, passwordEl)
        removeError(cPasswordErorr, cPasswordEl)
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