fetch('/check-session').then(res => res.json()).then(data => {
    if (!data.loggedIn) window.location.href = '/login.html';
    else {
        const path = window.location.pathname;
        if (path.includes('attendance')) loadAttendance();
        else if (path.includes('profile')) loadProfile();
    }
});

function loadAttendance() {
    fetch('/employee/attendance').then(res => res.json()).then(attendance => {
        document.querySelector('#attendanceTable tbody').innerHTML = attendance.map(a => `
            <tr>
                <td>${a.date}</td>
                <td>${a.check_in}</td>
                <td>${a.check_out}</td>
            </tr>
        `).join('');
    });
}

function loadProfile() {
    fetch('/employee/profile')
        .then(res => res.json())
        .then(user => {
            if (user.error) {
                document.getElementById('message').innerText = 'Không thể tải thông tin.';
                return;
            }

            document.getElementById('full_name').innerText = user.full_name || 'N/A';
            document.getElementById('email').innerText = user.email || 'N/A';
            document.getElementById('created_at').innerText = new Date(user.created_at).toLocaleDateString('vi-VN') || 'N/A';
        });
}


document.getElementById('attendanceForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const attendance = {
        check_in: document.getElementById('check_in').value,
        check_out: document.getElementById('check_out').value
    };
    const res = await fetch('/employee/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attendance) });
    const data = await res.json();
    const message = document.getElementById('message');
    message.className = 'message ' + (data.success ? 'success' : 'error');
    message.textContent = data.success ? 'Chấm công thành công!' : data.message;
    if (data.success) loadAttendance();
});

