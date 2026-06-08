# Task 3 — PHP User Management System

**Built by:** Karrothu Sai | Youngbot Academy Internship | Days 25–36

## Features
- User Registration with `password_hash()` (bcrypt)
- Login/Logout with PHP Sessions (`session_regenerate_id`)
- Role-Based Access Control — Admin / User
- All queries use `mysqli_prepare` (Prepared Statements — SQL Injection proof)
- Server-side validation on all inputs
- AJAX username/email availability check (no page reload)
- Edit Profile with profile picture upload (size & type validation)
- Admin Dashboard with full CRUD (Create, Read, Update, Delete)
- Search & filter users, pagination
- Toggle user active/inactive status
- Database normalized to 3NF (roles table + users table with FK)

## Tech Stack
- PHP 8+ (Sessions, password_hash, mysqli prepared statements)
- MySQL (Relational DB, FK constraints)
- Bootstrap 5 (Responsive UI)
- HTML5, CSS3, JavaScript (AJAX fetch)

## Setup Instructions

### 1. Requirements
- XAMPP / WAMP / LAMP (PHP 8+, MySQL 5.7+)

### 2. Database Setup
1. Open phpMyAdmin → `http://localhost/phpmyadmin`
2. Click **Import** → select `setup.sql` → Execute
3. This creates the `task3_usermgmt` database with tables and seed data

### 3. Run the Project
1. Copy `task3/` folder to `C:/xampp/htdocs/task3/`
2. Start Apache + MySQL in XAMPP Control Panel
3. Open browser → `http://localhost/task3/`

### 4. Default Login
| Role  | Email            | Password   |
|-------|------------------|------------|
| Admin | admin@demo.com   | Admin@123  |

## Database Design (3NF)

### roles table
| Column      | Type         | Notes      |
|-------------|--------------|------------|
| id          | INT PK AI    |            |
| name        | VARCHAR(50)  | UNIQUE     |
| description | VARCHAR(255) |            |
| created_at  | TIMESTAMP    |            |

### users table
| Column      | Type         | Notes             |
|-------------|--------------|-------------------|
| id          | INT PK AI    |                   |
| fullname    | VARCHAR(100) |                   |
| username    | VARCHAR(50)  | UNIQUE            |
| email       | VARCHAR(150) | UNIQUE            |
| password    | VARCHAR(255) | bcrypt hashed     |
| role_id     | INT FK       | → roles.id        |
| profile_pic | VARCHAR(255) |                   |
| bio         | TEXT         |                   |
| phone       | VARCHAR(20)  |                   |
| is_active   | TINYINT(1)   | 1=active, 0=banned|
| created_at  | TIMESTAMP    |                   |
| updated_at  | TIMESTAMP    | auto-updates      |

### Normalization
- **1NF**: Atomic values, no repeating groups
- **2NF**: roles separated into its own table (no partial dependency)
- **3NF**: role name not stored in users — only FK to roles (no transitive dependency)

## File Structure
```
task3/
├── index.php           → redirect based on session
├── login.php           → login with prepared stmt
├── register.php        → registration + bcrypt
├── logout.php          → session destroy
├── dashboard.php       → user dashboard
├── profile.php         → edit profile + pic upload
├── setup.sql           → database schema + seed
├── includes/
│   ├── db.php          → MySQL connection
│   └── auth.php        → session helpers, sanitize
├── admin/
│   ├── dashboard.php   → CRUD user list
│   ├── add_user.php    → add user form
│   ├── edit_user.php   → edit user form
│   ├── delete_user.php → delete with pic cleanup
│   └── toggle_status.php → activate/deactivate
├── ajax/
│   ├── check_username.php → AJAX username check
│   └── check_email.php    → AJAX email check
├── css/
│   └── style.css
└── uploads/            → profile pictures
```
