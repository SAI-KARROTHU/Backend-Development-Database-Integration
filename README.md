# Task 4: Real-World Web Application

## Overview
This repository contains the deliverables for Task 4: A full-stack **Online Bookstore** web application built with a focus on real-world capabilities. It features an integrated Admin Panel and essential CRUD operations, as well as a comprehensive database design to handle products, users, and orders efficiently.

## Deliverables
- **Project Idea Chosen**: Online Bookstore
- **Requirements Document**: [REQUIREMENTS.md](./REQUIREMENTS.md) (Contains Features, User Roles, Use Cases, and Wireframe structure).
- **Database Schema**: [schema.sql](./schema.sql) (Contains optimized SQL schema with relationships, foreign keys, and indexes).
- **Core Features**:
  - **Authentication**: Registration, Login, Forgot Password handling.
  - **CRUD Operations**: Management of Books (Products), Orders, and internal Admin Tasks.
  - **Search & Filters**: Search books by title/author, filter by category/price, and pagination.
  - **Admin Dashboard**: View total active users, orders per day, and overall platform statistics.

## Project Structure

```text
task4/
│
├── REQUIREMENTS.md       # Full documentation of features, roles, and use cases
├── schema.sql            # Database creation script (tables, indexes, foreign keys)
└── README.md             # This file
```

## Next Steps for Core Development
If advancing to the Core Development phase, the following stack is recommended:
- **Frontend**: React or Next.js, styled with Vanilla CSS (vibrant colors, dynamic animations, dark mode) or TailwindCSS if preferred.
- **Backend**: Node.js with Express, or Python with Django/FastAPI.
- **Database Engine**: MySQL or PostgreSQL (schema is optimized for relational SQL).

## How to Test the Database
You can load the `schema.sql` file into your preferred database client (e.g., MySQL Workbench or phpMyAdmin) to instantiate the `bookstore_db` database and review the structural relationships.
