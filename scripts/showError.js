export function showError(errorDiv, inputDiv, str) {
    errorDiv.style.visibility = 'visible'
    errorDiv.textContent = str
    inputDiv.style.border = '1px solid #c20404'
}

export function removeError(errorDiv, inputDiv) {
    errorDiv.style.visibility = 'hidden'
    inputDiv.style.border = '1px solid #b0b0b0'
}

export function showErrorUserProfile(errorDiv, inputDiv, str) {
    errorDiv.style.visibility = 'visible'
    errorDiv.textContent = str
    inputDiv.style.border = '2px solid #c20404'
    inputDiv.style.borderRight = 'none'
}

export function removeErrorUserProfile(errorDiv, inputDiv) {
    errorDiv.style.visibility = 'hidden'
    inputDiv.style.border = '2px solid #174dca'
    inputDiv.style.borderRight = 'none'
}