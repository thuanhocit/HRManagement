const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../db/database.sqlite'));

// Hàm xem dữ liệu từ một bảng
function viewTable(tableName) {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            console.error(`Error querying ${tableName}:`, err.message);
            return;
        }
        console.log(`\nData in ${tableName}:`);
        console.table(rows);
    });
}

// Xem tất cả các bảng
viewTable('users');
viewTable('positions');
viewTable('working_hours');
viewTable('attendance');
viewTable('salaries');
viewTable('reward_discipline');

// Đóng kết nối sau 2 giây
setTimeout(() => db.close(), 2000);