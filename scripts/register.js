import { checkUserEmail, checkUserUsername, checkUserPassword } from './checkUserData.js';
import { showError, removeError } from './showError.js';
const firstNameEl = document.querySelector('input[name="first-name"]')
const lastNameEl = document.querySelector('input[name="last-name"]')
const usernameEl = document.querySelector('input[name="username"]')
const emailEl = document.querySelector('input[name="email"]')
const dobEl = document.querySelector('input[name="date-of-birth"]')
const passwordEl = document.querySelector('input[name="password"]')
const cPasswordEl = document.querySelector('input[name="confirm-password"]')
const btn = document.querySelector('button')
const errorDiv = document.querySelectorAll('.error-msg')
const pageInputs = document.querySelectorAll('input')


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
    } else {
        pageInputs.forEach(pageInput => removeError(pageInput.nextElementSibling, pageInput))
    }

    if (!checkUserEmail(email, emailError, emailEl)) {
        return
    }
    if (!checkUserUsername(username, usernameError, usernameEl)) {
        return
    }
    if (!checkUserPassword(password, cPassword, passwordError, passwordEl, cPasswordErorr, cPasswordEl)) {
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