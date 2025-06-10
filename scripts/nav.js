const nav = document.createElement('nav')
nav.innerHTML = `<ul class='header'>
        <li class='back'><a href='login.html'><i class="bi bi-arrow-left-square"></i> Back</a></li>
        <li class='heading'>To Do List</li>
        <div class='profile-handle'>
            <li class='logout'>Logout</li>
            <i class="bi bi-person-circle"></i>
        </div>
    </ul>`

export { nav }