import { removeError, showError } from "./showError.js"
const users = JSON.parse(localStorage.getItem('users')) || []

export function checkUserEmail(email, emailError, emailEl) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailError, emailEl, '*Please eneter valid email!')
        return false
    } else {
        removeError(emailError, emailEl)
    }
    const emailAlreadyExist = users.find(user => user.email === email)
    if (emailAlreadyExist) {
        showError(emailError, emailEl, '*Email already registered!')
        return false
    } else {
        removeError(emailError, emailEl)
    }
    return true
}

export function checkUserUsername(username, usernameError, usernameEl) {
    if (/[^a-zA-Z0-9_]/.test(username)) {
        showError(usernameError, usernameEl, '*Characters, numbers and _ are only allowed for username field!')
        return false
    } else {
        removeError(usernameError, usernameEl)
    }
    const usernameAlreadyExist = users.find(user => user.username === username)
    if (usernameAlreadyExist) {
        showError(usernameError, usernameEl, '*User exists, please choose another username')
        return false
    } else {
        removeError(usernameError, usernameEl)
    }
    if (username.length < 8) {
        showError(usernameError, usernameEl, '*Username must be 8 character long!')
        return false
    } else {
        removeError(usernameError, usernameEl)
    }
    return true
}


export function checkUserPassword(password, cPassword, passwordError, passwordEl, cPasswordErorr, cPasswordEl) {
    if (password !== cPassword) {
        showError(passwordError, passwordEl, "*Both password doesn't matching!")
        showError(cPasswordErorr, cPasswordEl, "*Both password doesn't matching!")
        return false
    } else {
        removeError(passwordError, passwordEl)
        removeError(cPasswordErorr, cPasswordEl)
    }
    return true
}