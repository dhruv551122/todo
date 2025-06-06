import { showError } from "./showError.js"

document.addEventListener('DOMContentLoaded', function () {
    const usernameEl = document.querySelector('input[name="username"]')
    const passwordEl = document.querySelector('input[name="password"]')
    const btn = document.querySelector('button')
    const errorDiv = document.querySelector('.error')
    const users = JSON.parse(localStorage.getItem('users')) || []

    function validateLogin(e) {
        e.preventDefault()
        const username = usernameEl.value.trim()
        const password = passwordEl.value.trim()
        if (!username || !password) {
            showError(errorDiv, "Please enter username/email and password")
            return
        }
        const userExist = users.find(user => (user.username === username) || (user.email === username))
        if (!userExist) {
            showError(errorDiv, "User doesn't exist with this username or email please register or try again!")
            return
        }
        if (userExist.password !== password) {
            showError(errorDiv, "Incorrect Password please try again!")
            passwordEl.value = ''
            return
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
