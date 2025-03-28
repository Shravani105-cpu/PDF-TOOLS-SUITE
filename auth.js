// Check authentication status and update UI
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken');
    const navbarUser = document.getElementById('navbarUser');
    
    if (token) {
        // User is logged in - show profile
        const user = JSON.parse(localStorage.getItem('user'));
        showUserProfile(user);
    } else {
        // User is not logged in - show login/signup buttons
        showAuthButtons();
    }
});

// Show user profile in navbar
function showUserProfile(user) {
    const navbarUser = document.getElementById('navbarUser');
    if (!navbarUser) return;
    
    // Get first letter of name for avatar
    const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    
    navbarUser.innerHTML = `
        <div class="user-profile" onclick="toggleDropdown()">
            <div class="user-avatar">${avatarLetter}</div>
            <span class="user-name">${user.name || 'User'}</span>
            <i class="fas fa-caret-down"></i>
        </div>
        <div class="dropdown-menu" id="userDropdown">
            <a href="dashboard.html">Dashboard</a>
            <a href="settings.html">Settings</a>
            <a href="#" onclick="logout()">Logout</a>
        </div>
    `;
}

// Show login/signup buttons
function showAuthButtons() {
    const navbarUser = document.getElementById('navbarUser');
    if (!navbarUser) return;
    
    navbarUser.innerHTML = `
        <a href="public/login.html" class="login-btn">Login</a>
        <a href="public/signup.html" class="signup-btn">Sign Up</a>
    `;
}

// Toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-profile')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});

// Logout function
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'home.html';
}