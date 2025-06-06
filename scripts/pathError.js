
export function pageNotFound() {
    console.log(location.pathname)
    if (location.pathname !== '/login.html' && location.pathname !== '/register.html' && location.pathname !== '/index.html') {
        console.log('Page not found')
        document.body.innerHTML = 'Page not found'
    }
}