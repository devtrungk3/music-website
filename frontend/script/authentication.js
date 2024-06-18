window.onload = function () {
    checkAuthentication();
    const signoutButton = document.getElementById('btnSignout');
    if (signoutButton) {
        signoutButton.addEventListener('click', handleLogout);
    }
};

// Check authentication token
function checkAuthentication() {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    if (accessToken && isSigninPage()) {
        redirectToIndex();
        return;
    } 
    else if (!accessToken && isIndexPage()) {
        redirectToSignin();
    }
}

function redirectToSignin() {
    window.location.href = 'signin.html';
}

function redirectToIndex() {
    window.location.href = 'index.html';
}

// Handle logout event
function handleLogout() {
    localStorage.removeItem('accessToken');
    window.location.href = 'signin.html';
}

function isSigninPage() {
    return window.location.pathname.endsWith('signin.html');
}
function isIndexPage() {
    return window.location.pathname.endsWith('index.html');
}

// Get user full name
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const response = await fetch(`${serverUrl}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user info');
        }

        const user = await response.json();
        document.getElementById('userFullName').textContent = user.fullname;
    } catch (error) {
        console.error('Error fetching user info:', error);
        document.getElementById('userFullName').textContent = 'Error loading user data';
    }
});
