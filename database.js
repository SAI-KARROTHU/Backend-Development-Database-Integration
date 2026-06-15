const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// Connect to SQLite database
const dbPath = path.join(__dirname, 'bookstore.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Create Users Table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'customer'
            )
        `);

        // Create Books Table
        db.run(`
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER DEFAULT 0
            )
        `);

        // Create Orders Table
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                total REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // Create Reviews Table
        db.run(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                book_id INTEGER,
                user_id INTEGER,
                rating INTEGER CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(book_id) REFERENCES books(id),
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // Insert mock data if books table is empty
        db.get("SELECT COUNT(*) AS count FROM books", (err, row) => {
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)");
                stmt.run("The Great Gatsby", "F. Scott Fitzgerald", 10.99, 15);
                stmt.run("1984", "George Orwell", 8.99, 30);
                stmt.run("To Kill a Mockingbird", "Harper Lee", 12.50, 20);
                stmt.finalize();
                console.log("Mock books inserted.");
            }
        });

        // Insert mock users (with hashed passwords)
        db.get("SELECT COUNT(*) AS count FROM users", async (err, row) => {
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
                
                const hash1 = await bcrypt.hash("admin123", 10);
                const hash2 = await bcrypt.hash("pass123", 10);
                const hash3 = await bcrypt.hash("pass123", 10);

                stmt.run("admin", "admin@bookstore.com", hash1, "admin");
                stmt.run("johndoe", "john@example.com", hash2, "customer");
                stmt.run("janedoe", "jane@example.com", hash3, "customer");
                stmt.finalize();
                console.log("Mock users inserted (passwords hashed).");
            }
        });

        // Insert mock orders
        db.get("SELECT COUNT(*) AS count FROM orders", (err, row) => {
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)");
                stmt.run(2, 21.98, "delivered");
                stmt.run(3, 8.99, "pending");
                stmt.run(2, 12.50, "shipped");
                stmt.run(3, 10.99, "processing");
                stmt.run(2, 45.00, "pending");
                stmt.finalize();
                console.log("Mock orders inserted.");
            }
        });

        // Insert mock reviews
        db.get("SELECT COUNT(*) AS count FROM reviews", (err, row) => {
            if (row.count === 0) {
                const stmt = db.prepare("INSERT INTO reviews (book_id, user_id, rating, comment) VALUES (?, ?, ?, ?)");
                stmt.run(1, 2, 5, "An absolute classic. Loved every page!");
                stmt.run(2, 3, 4, "Very thought-provoking, though a bit dark.");
                stmt.run(3, 2, 5, "A must-read for everyone.");
                stmt.finalize();
                console.log("Mock reviews inserted.");
            }
        });
    });
}

module.exports = db;
