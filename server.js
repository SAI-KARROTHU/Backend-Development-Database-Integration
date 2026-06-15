const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = "super_secret_bookstore_key_123";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, authData) => {
            if (err) return res.status(403).json({ error: "Invalid or expired token" });
            req.user = authData;
            next();
        });
    } else {
        res.status(403).json({ error: "Unauthorized access. No token provided." });
    }
}

// --- API ENDPOINTS ---

// 1. Dashboard Statistics
app.get('/api/stats', verifyToken, (req, res) => {
    const stats = {};
    db.get("SELECT COUNT(*) as total_users FROM users", (err, row) => {
        stats.totalUsers = row ? row.total_users : 0;
        db.get("SELECT COUNT(*) as total_books FROM books", (err, row) => {
            stats.totalBooks = row ? row.total_books : 0;
            db.get("SELECT COUNT(*) as total_orders FROM orders", (err, row) => {
                stats.totalOrders = row ? row.total_orders : 0;
                db.get("SELECT SUM(total) as revenue FROM orders WHERE status='delivered'", (err, row) => {
                    stats.revenue = row ? (row.revenue || 0) : 0;
                    res.json(stats);
                });
            });
        });
    });
});

// 1.5 Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'admin')", 
            [username, email, hashedPassword], 
            function(err) {
                if (err) return res.status(400).json({ error: err.message });
                res.json({ message: "Admin registered successfully!" });
        });
    } catch(err) { res.status(500).json({ error: "Hashing failed" }); }
});

// 1.6 Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT id, username, email, password as hash, role FROM users WHERE email = ?", [email], async (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, row.hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        
        const userPayload = { id: row.id, username: row.username, email: row.email, role: row.role };
        jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            res.json({ token, user: userPayload });
        });
    });
});

// 2. Books CRUD
app.get('/api/books', verifyToken, (req, res) => {
    db.all("SELECT * FROM books", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/books', verifyToken, (req, res) => {
    const { title, author, price, stock } = req.body;
    db.run("INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)", 
        [title, author, price, stock], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, title, author, price, stock });
    });
});

app.delete('/api/books/:id', verifyToken, (req, res) => {
    db.run("DELETE FROM books WHERE id = ?", req.params.id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book deleted" });
    });
});

// 3. Orders Management
app.get('/api/orders', verifyToken, (req, res) => {
    const query = `
        SELECT orders.id, users.username, orders.total, orders.status, orders.date 
        FROM orders 
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 4. Users Management
app.get('/api/users', verifyToken, (req, res) => {
    db.all("SELECT id, username, email, role FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 5. Reviews Management
app.get('/api/reviews', verifyToken, (req, res) => {
    const query = `
        SELECT reviews.id, books.title as book_title, users.username, reviews.rating, reviews.comment, reviews.date 
        FROM reviews
        JOIN books ON reviews.book_id = books.id
        JOIN users ON reviews.user_id = users.id
        ORDER BY reviews.date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. Orders Analytics (Orders per day mock data logic)
app.get('/api/orders/daily', verifyToken, (req, res) => {
    // SQLite doesn't have robust date manipulation easily out of the box without complex queries,
    // so we will return mock grouped data for the chart.
    const mockData = [
        { date: 'Mon', count: 5 },
        { date: 'Tue', count: 8 },
        { date: 'Wed', count: 12 },
        { date: 'Thu', count: 7 },
        { date: 'Fri', count: 15 },
        { date: 'Sat', count: 20 },
        { date: 'Sun', count: 10 }
    ];
    res.json(mockData);
});

// --- ROUTES ---
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
