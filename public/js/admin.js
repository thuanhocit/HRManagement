function isNumericOnly(str) {
    return /^\d+$/.test(str.trim());
}
function containsNumber(str) {
    return /\d/.test(str);
}

fetch('/check-session').then(res => res.json()).then(data => {
    if (!data.loggedIn || data.role !== 'admin') window.location.href = '/login.html';
    else {
        const path = window.location.pathname;
        if (path.includes('staff')) { loadStaff(); loadPositions(); }
        else if (path.includes('position')) loadPositions();
        else if (path.includes('time')) { loadWorkingHours(); loadUsers(); }
        else if (path.includes('attendance')) loadAttendance();
        else if (path.includes('salary')) { loadSalaries(); loadUsers(); }
        else if (path.includes('reward_discipline')) { loadRewards(); loadUsers(); }
        else if (path.includes('statistics')) loadStatistics();
    }
});

function loadStaff() {
    fetch('/admin/staff').then(res => res.json()).then(staffs => {
        document.querySelector('#staffTable tbody').innerHTML = staffs.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.username}</td>
                <td>${s.full_name}</td>
                <td>${s.position_name || 'Chưa có'}</td>
                <td>${s.role}</td>
                <td>
                    <button onclick="editStaff(${s.id}, '${s.username}', '${s.full_name}', '${s.position_id || ''}', '${s.role}')">Sửa</button>
                    <button onclick="deleteStaff(${s.id})">Xóa</button>
                </td>
            </tr>
        `).join('');
    });
}

function editStaff(id, username, full_name, position_id, role) {
    const editForm = document.getElementById('editForm');
    editForm.style.display = 'block';
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_username').value = username;
    document.getElementById('edit_full_name').value = full_name;
    document.getElementById('edit_position_id').value = position_id;
    document.getElementById('edit_role').value = role;
}

document.getElementById('editStaffForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const staff = {
        username: document.getElementById('edit_username').value,
        full_name: document.getElementById('edit_full_name').value,
        position_id: document.getElementById('edit_position_id').value,
        role: document.getElementById('edit_role').value
    };
    const password = document.getElementById('edit_password').value;
    if (password) staff.password = password;

    const res = await fetch(`/admin/staff/${document.getElementById('edit_id').value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
    });
    const data = await res.json();
    document.getElementById('message').className = 'message ' + (data.success ? 'success' : 'error');
    document.getElementById('message').textContent = data.success ? 'Cập nhật thành công!' : data.error;
    loadStaff();
    document.getElementById('editForm').style.display = 'none';
});

function loadPositions() {
    fetch('/admin/positions').then(res => res.json()).then(positions => {
        const select = document.getElementById('position_id');
        if (select) select.innerHTML = '<option value="">Chọn chức vụ</option>' + positions.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        const tbody = document.querySelector('#positionTable tbody');
        if (tbody) tbody.innerHTML = positions.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td><button onclick="deletePosition(${p.id})">Xóa</button></td>
            </tr>
        `).join('');
    });
}

function loadUsers() {
    fetch('/admin/staff').then(res => res.json()).then(users => {
        const select = document.getElementById('user_id');
        if (select) select.innerHTML = '<option value="">Chọn nhân viên</option>' + users.map(u => `<option value="${u.id}">${u.username}</option>`).join('');
    });
}

function loadWorkingHours() {
    fetch('/admin/working-hours').then(res => res.json()).then(hours => {
        document.querySelector('#timeTable tbody').innerHTML = hours.map(h => `
            <tr>
                <td>${h.id}</td>
                <td>${h.username}</td>
                <td>${h.date}</td>
                <td>${h.hours}</td>
                <td><button onclick="deleteWorkingHour(${h.id})">Xóa</button></td>
            </tr>
        `).join('');
    });
}

function loadAttendance() {
    fetch('/admin/attendance').then(res => res.json()).then(attendance => {
        document.querySelector('#attendanceTable tbody').innerHTML = attendance.map(a => `
            <tr>
                <td>${a.id}</td>
                <td>${a.username}</td>
                <td>${a.date}</td>
                <td>${a.check_in}</td>
                <td>${a.check_out}</td>
            </tr>
        `).join('');
    });
}

function loadSalaries() {
    fetch('/admin/salaries').then(res => res.json()).then(salaries => {
        document.querySelector('#salaryTable tbody').innerHTML = salaries.map(s => `
            <tr>
                <td>${s.id}</td>
                <td>${s.username}</td>
                <td>${s.amount}</td>
                <td>${s.month}</td>
                <td><button onclick="deleteSalary(${s.id})">Xóa</button></td>
            </tr>
        `).join('');
    });
}

function loadRewards() {
    fetch('/admin/reward-discipline').then(res => res.json()).then(records => {
        document.querySelector('#rewardTable tbody').innerHTML = records.map(r => `
            <tr>
                <td>${r.id}</td>
                <td>${r.username}</td>
                <td>${r.type === 'reward' ? 'Khen thưởng' : 'Kỷ luật'}</td>
                <td>${r.description}</td>
                <td>${r.date}</td>
                <td><button onclick="deleteReward(${r.id})">Xóa</button></td>
            </tr>
        `).join('');
    });
}

function loadStatistics() {
    fetch('/admin/statistics').then(res => res.json()).then(stats => {
        document.querySelector('#statsTable tbody').innerHTML = stats.map(s => `
            <tr>
                <td>${s.username}</td>
                <td>${s.total_hours}</td>
            </tr>
        `).join('');
    });
}

document.getElementById('staffForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const staff = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        full_name: document.getElementById('full_name').value,
        position_id: document.getElementById('position_id').value,
        role: document.getElementById('role').value
    };

    if (isNumericOnly(staff.full_name)) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Họ tên không được chỉ gồm số.';
        return;
    }

    if (isNumericOnly(staff.username)) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Tên đăng nhập không được chỉ gồm số.';
        return;
    }

    const res = await fetch('/admin/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(staff) });
    const data = await res.json();
    document.getElementById('message').className = 'message success';
    document.getElementById('message').textContent = 'Thêm thành công!';
    loadStaff();
    e.target.reset();
});


document.getElementById('positionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();

    if (containsNumber(name)) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Tên chức vụ không được chứa số.';
        return;
    }

    const position = { name };
    await fetch('/admin/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position)
    });

    document.getElementById('message').className = 'message success';
    document.getElementById('message').textContent = 'Thêm thành công!';
    loadPositions();
    e.target.reset();
});


document.getElementById('timeForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const hours = parseInt(document.getElementById('hours').value);
    if (isNaN(hours) || hours < 1 || hours > 24) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Số giờ phải từ 1 đến 24.';
        return;
    }

    const time = {
        user_id: document.getElementById('user_id').value,
        date: document.getElementById('date').value,
        hours: hours
    };
    await fetch('/admin/working-hours', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(time) });
    document.getElementById('message').className = 'message success';
    document.getElementById('message').textContent = 'Thêm thành công!';
    loadWorkingHours();
    e.target.reset();
});


document.getElementById('salaryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('user_id').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!userId) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Vui lòng chọn nhân viên.';
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Số tiền phải là số dương lớn hơn 0.';
        return;
    }

    const salary = {
        user_id: userId,
        amount,
        month: document.getElementById('date').value 
    };

    await fetch('/admin/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salary)
    });

    document.getElementById('message').className = 'message success';
    document.getElementById('message').textContent = 'Thêm thành công!';
    loadSalaries();
    e.target.reset();
});


document.getElementById('rewardForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (!user_id) {
        document.getElementById('message').className = 'message error';
        document.getElementById('message').textContent = 'Vui lòng chọn nhân viên!';
        return;
    }

    const reward = { user_id, type, description, date };
    const res = await fetch('/admin/reward-discipline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reward)
    });
    const data = await res.json();
    document.getElementById('message').className = 'message ' + (data.success ? 'success' : 'error');
    document.getElementById('message').textContent = data.success ? 'Thêm thành công!' : data.message || data.error;
    if (data.success) {
        loadRewards();
        e.target.reset();
    }
});

function deleteStaff(id) {
    fetch(`/admin/staff/${id}`, { method: 'DELETE' }).then(() => loadStaff());
}

function deletePosition(id) {
    fetch(`/admin/positions/${id}`, { method: 'DELETE' }).then(() => loadPositions());
}

function deleteWorkingHour(id) {
    fetch(`/admin/working-hours/${id}`, { method: 'DELETE' }).then(() => loadWorkingHours());
}

function deleteSalary(id) {
    fetch(`/admin/salaries/${id}`, { method: 'DELETE' }).then(() => loadSalaries());
}

function deleteReward(id) {
    fetch(`/admin/reward-discipline/${id}`, { method: 'DELETE' }).then(() => loadRewards());
}

if (path.includes('database')) loadDatabase();

function loadDatabase() {
    fetch('/admin/database').then(res => res.json()).then(data => {
        const container = document.getElementById('tables');
        Object.keys(data).forEach(table => {
            const h3 = document.createElement('h3');
            h3.textContent = table;
            container.appendChild(h3);
            const tableEl = document.createElement('table');
            if (data[table].error) {
                tableEl.innerHTML = `<tr><td>${data[table].error}</td></tr>`;
            } else if (data[table].length > 0) {
                const headers = Object.keys(data[table][0]);
                tableEl.innerHTML = `
                    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${data[table].map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`).join('')}</tbody>
                `;
            } else {
                tableEl.innerHTML = '<tr><td>Không có dữ liệu</td></tr>';
            }
            container.appendChild(tableEl);
        });
    });
}