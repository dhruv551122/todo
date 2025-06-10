export function showError(errorDiv, inputDiv, str) {
    errorDiv.style.visibility = 'visible'
    errorDiv.textContent = str
    inputDiv.style.border = '1px solid #c20404'
}

export function removeError(errorDiv, inputDiv) {
    errorDiv.style.visibility = 'hidden'
    inputDiv.style.border = '1px solid #b0b0b0'
}
