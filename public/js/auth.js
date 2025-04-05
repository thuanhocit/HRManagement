document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();

    message.className = 'message ' + (data.success ? 'success' : 'error');
    message.textContent = data.success ? 'Đăng nhập thành công!' : data.message;
    if (data.success) {
        setTimeout(() => {
            window.location.href = data.role === 'admin' ? '/admin/dashboard.html' : '/employee/dashboard.html';
        }, 1000);
    }
});

fetch('/check-session').then(res => res.json()).then(data => {
    if (data.loggedIn) {
        window.location.href = data.role === 'admin' ? '/admin/dashboard.html' : '/employee/dashboard.html';
    }
});