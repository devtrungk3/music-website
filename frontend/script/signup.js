let serverUrl ="http://127.0.0.1:3000";

document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('user_name').value;
    const fullname = document.getElementById('full_name').value;
    const email = document.getElementById('user_email').value;
    const password = document.getElementById('user_password').value;
    const rePassword = document.getElementById('user_re_password').value;

    if (password !== rePassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                fullname: fullname,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            // Store the access token and handle the remember me functionality
            localStorage.setItem('accessToken', data.accessToken);
            // Redirect to welcome.html
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert(`Sign up failed: ${errorData.error}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
});


