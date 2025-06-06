import { removeError, showError } from "./showError.js"

document.addEventListener('DOMContentLoaded', function () {
    const usernameEl = document.querySelector('input[name="username"]')
    const usernameError = usernameEl.nextElementSibling
    const passwordEl = document.querySelector('input[name="password"]')
    const passwordError = passwordEl.nextElementSibling
    const btn = document.querySelector('button')
    const errorDiv = document.querySelector('.error-msg')
    const users = JSON.parse(localStorage.getItem('users')) || []

    function validateLogin(e) {
        e.preventDefault()
        const username = usernameEl.value.trim()
        const password = passwordEl.value.trim()
        if (!username) {
            showError(usernameError, usernameEl, "*Please enter username/email")
        } else {
            removeError(usernameError, usernameEl)
        }
        if (!password) {
            showError(passwordError, passwordEl, "*Incorrect Password please try again!")
            return
        } else {
            removeError(passwordError, passwordEl)
        }
        const userExist = users.find(user => (user.username === username) || (user.email === username))
        if (!userExist) {
            showError(usernameError, usernameEl, "*User doesn't exist with this username or email please register or try again!")
            return
        } else {
            removeError(usernameError, usernameEl)
        }
        if (userExist.password !== password) {
            showError(passwordError, passwordEl, "*Incorrect Password please try again!")
            passwordEl.value = ''
            return
        } else {
            removeError(passwordError, passwordEl)
        }
        userExist.isLoggedIn = true
        localStorage.setItem('currentUser', JSON.stringify(userExist))
        usernameEl.value = ''
        passwordEl.value = ''
        document.body.innerHTML = 'loading...'
        location.href = 'index.html'
    }

    btn.addEventListener('click', validateLogin)
});
