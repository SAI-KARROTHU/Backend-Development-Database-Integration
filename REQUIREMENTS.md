# Online Bookstore - Requirements Document

## 1. Project Overview
The Online Bookstore is a web application that allows users to browse, search, and purchase books online. It includes an administrative panel for managing the inventory, processing orders, and viewing analytics.

## 2. User Roles
- **Guest / Unregistered User**: Can browse books, search, and view book details. Must register/login to make a purchase.
- **Customer (Logged In)**: Can browse books, search, filter, add books to cart, place orders, view order history, and update profile/password.
- **Administrator**: Has access to a secure Dashboard. Can manage users, manage books (CRUD), manage orders (CRUD), and view analytics/statistics.

## 3. Key Features

### 3.1. Authentication & Authorization
- **Register**: Users can create an account using email and password.
- **Login/Logout**: Secure login using JWT or session-based authentication.
- **Forgot Password**: Ability to request a password reset link.
- **Role-based Access Control**: Restrict admin routes to Administrators only.

### 3.2. Customer Features
- **Book Catalog**: View all available books with pagination.
- **Search & Filter**: Search books by title, author, or ISBN. Filter by category or price range.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Checkout**: Place an order from the cart items.
- **Order History**: View past orders and their status.

### 3.3. Admin Dashboard (CRUD & Analytics)
- **Dashboard Statistics**: View overall metrics such as Total Sales, Active Users, and Orders Per Day.
- **Manage Books (CRUD)**: Create, Read, Update, and Delete books in the catalog.
- **Manage Orders (CRUD)**: View all orders, update order status (e.g., Pending, Shipped, Delivered), and delete cancelled orders.
- **Manage Users**: View registered users, block/unblock accounts, or change roles.

## 4. Use Cases

### Use Case 1: Customer Purchases a Book
1. Customer logs into the application.
2. Customer searches for a specific book title.
3. Customer adds the book to their cart.
4. Customer proceeds to checkout and places the order.
5. The system records the order and updates inventory.

### Use Case 2: Admin Adds a New Book
1. Admin logs into the Admin panel.
2. Admin navigates to "Manage Books".
3. Admin clicks "Add New Book" and fills out the form (Title, Author, Price, Stock, Category).
4. System saves the book and makes it visible in the public catalog.

### Use Case 3: Admin Views Analytics
1. Admin logs into the Admin panel.
2. Admin lands on the Dashboard.
3. System displays a chart of Orders Per Day and total Active Users.

## 5. Wireframes Plan
*(Wireframes are typically created in Figma/Canva, but here is the structural layout plan)*

- **Home Page**: Navigation bar (Logo, Search, Login/Cart). Hero section promoting sales. Grid of featured books.
- **Book Details Page**: Large book cover image. Title, Author, Price, Description. "Add to Cart" button.
- **Admin Dashboard**: Sidebar navigation (Dashboard, Books, Orders, Users, Logout). Main content area with top statistic cards, followed by charts (Orders per day) and recent activity tables.
- **CRUD Modals/Pages**: Forms with clear input fields, validation error messages, and Save/Cancel buttons.
