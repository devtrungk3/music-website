let serverUrl ="http://127.0.0.1:3000";
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('user_name').value;
    const password = document.getElementById('user_password').value;

    try {
        const response = await fetch(serverUrl+'/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        console.log(response)

        if (response.ok) {
            const data = await response.json();
            // Store the access token and handle the remember me functionality
            localStorage.setItem('accessToken', data.accessToken);
            getUserId();
            // Redirect to index.html
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});


async function getUserId(){
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Token not found in localStorage');
        }

        const response = await fetch(serverUrl+'/users', {
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
        userId= user.id;
       
    } catch (error) {
        console.error('Error fetching user info:', error);
        document.getElementById('userFullName').textContent = 'Error loading user data';
    }
}