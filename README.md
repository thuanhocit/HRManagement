# HRManagement

## Tổng quan
HRManagement là một hệ thống quản lý nhân sự đơn giản được xây dựng bằng Node.js, Express, và SQLite. Dự án này cho phép:

- Admin quản lý nhân sự, chức vụ, giờ làm, chấm công, lương, khen thưởng/kỷ luật, và thống kê.
- Nhân viên chỉ có thể chấm công, không được phép chỉnh sửa thông tin cá nhân.

## Tính năng chính
### Đối với Admin
- Quản lý nhân sự: Thêm, sửa, xóa nhân viên.
- Quản lý chức vụ: Thêm, xóa chức vụ.
- Quản lý giờ làm: Ghi nhận giờ làm của nhân viên.
- Theo dõi chấm công: Xem lịch sử chấm công của tất cả nhân viên.
- Quản lý lương: Ghi nhận và xóa thông tin lương.
- Khen thưởng/Kỷ luật: Ghi nhận và xóa thông tin khen thưởng hoặc kỷ luật.
- Thống kê: Xem tổng giờ làm của từng nhân viên.

### Đối với Nhân viên
- Chấm công: Ghi nhận giờ check-in và check-out.
- Không có quyền chỉnh sửa thông tin cá nhân.

## Yêu cầu hệ thống
- Node.js: Phiên bản 14 trở lên.
- npm: Đi kèm với Node.js.

## Cài đặt và Chạy dự án
- Cài đặt: `npm install`
- Chạy dự án: `npm start`
- Server sẽ chạy trên `http://localhost:3000`.

Khi chạy dự án thì sẽ tạo 1 file database (`db/database.sqlite`). Khi có thay đổi cần xóa file `database.sqlite` để tạo lại database với dữ liệu mặc định.

## Dữ liệu mặc định
Khi chạy lần đầu, hệ thống sẽ tạo các dữ liệu mặc định:

- Tài khoản Admin:
  - Tên đăng nhập: admin
  - Mật khẩu: admin123
- Tài khoản Nhân viên:
  - Tên đăng nhập: employee
  - Mật khẩu: employee123
- Chức vụ mặc định:
  - Nhân viên
  - Quản lý

## Cách sử dụng
### Đăng nhập
- Truy cập `http://localhost:3000/login.html`.
- Đăng nhập bằng một trong các tài khoản mặc định:
  - Admin: `admin/admin123`
  - Nhân viên: `employee/employee123`

### Đối với Admin
- Dashboard: `/admin/dashboard.html` - Tổng quan.
- Quản lý nhân sự: `/admin/staff.html` - Thêm, sửa, xóa nhân viên.
  - Tên không được bắt đầu bằng số hoặc chỉ chứa số.
- Quản lý chức vụ: `/admin/position.html` - Thêm, xóa chức vụ.
  - Tên chức vụ không được bắt đầu bằng số hoặc chỉ chứa số.
- Giờ làm: `/admin/time.html` - Ghi nhận và xóa giờ làm.
- Chấm công: `/admin/attendance.html` - Xem lịch sử chấm công.
- Lương: `/admin/salary.html` - Ghi nhận và xóa lương.
- Khen thưởng/Kỷ luật: `/admin/reward_discipline.html` - Ghi nhận và xóa thông tin khen thưởng/kỷ luật.
- Thống kê: `/admin/statistics.html` - Xem tổng giờ làm của nhân viên.

### Đối với Nhân viên
- Chấm công: `/employee/attendance.html` - Ghi nhận giờ check-in và check-out.
- Nhân viên không có quyền chỉnh sửa thông tin cá nhân.

## Kiểm tra tính năng
### Admin:
- Đăng nhập bằng `admin/admin123`.
- Truy cập `/admin/staff.html`:
  - Thêm nhân viên với `full_name` là "123" > Báo lỗi: "Tên không được bắt đầu bằng số hoặc chỉ chứa số!".
  - Thêm với "Nguyễn Văn B" > Thành công.
  - Sửa nhân viên thành "456" > Báo lỗi.
- Truy cập `/admin/position.html`:
  - Thêm chức vụ "789" > Báo lỗi.
  - Thêm "Trưởng phòng" > Thành công.
- Truy cập `/admin/attendance.html`:
  - Xem danh sách chấm công của tất cả nhân viên.

### Nhân viên:
- Đăng nhập bằng `employee/employee123`.
- Truy cập `/employee/attendance.html`:
  - Ghi nhận giờ check-in/check-out.
  - Không có tùy chọn chỉnh sửa thông tin cá nhân.

## Công nghệ sử dụng
### Backend:
- Node.js, Express
- SQLite (database)
- bcrypt (mã hóa mật khẩu)

### Frontend:
- HTML, CSS, JavaScript
- Fetch API cho giao tiếp với backend