// UI Interaction Logic
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown if clicked outside
window.onclick = function(event) {
    if (!event.target.closest('.profile-container')) {
        const dropdowns = document.getElementsByClassName("profile-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
}

// Fetch API Wrapper for Auth
function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Navigation Logic
function showSection(sectionId) {
    // Update active nav link
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    event.currentTarget.parentElement.classList.add('active');

    // Update active section
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId + '-section').classList.add('active');

    // Update title
    const titles = {
        'dashboard': 'Overview Dashboard',
        'books': 'Manage Books',
        'orders': 'Orders Management',
        'users': 'Users Management',
        'reviews': 'Customer Reviews'
    };
    document.getElementById('page-title').innerText = titles[sectionId] || 'Dashboard';

    if (sectionId === 'dashboard') loadDashboardData();
    if (sectionId === 'books') loadBooksData();
    if (sectionId === 'orders') loadOrdersData();
    if (sectionId === 'users') loadUsersData();
    if (sectionId === 'reviews') loadReviewsData();
    if (sectionId === 'profile') {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const profName = document.getElementById('prof-name');
                if (profName) profName.innerText = user.username;
                const profEmail = document.getElementById('prof-email');
                if (profEmail) profEmail.innerText = user.email;
                const profRole = document.getElementById('prof-role');
                if (profRole) profRole.innerText = (user.role || 'Admin').toUpperCase();
            } catch(e) {}
        }
    }
}

// Data Fetching
async function loadDashboardData() {
    try {
        const statsRes = await fetch('/api/stats', { headers: getAuthHeaders() });
        const stats = await statsRes.json();
        
        document.getElementById('stat-users').innerText = stats.totalUsers;
        document.getElementById('stat-books').innerText = stats.totalBooks;
        document.getElementById('stat-orders').innerText = stats.totalOrders;
        document.getElementById('stat-revenue').innerText = `$${stats.revenue.toFixed(2)}`;

        loadChartData();
    } catch (e) { console.error("Error loading stats", e); }
}

async function loadChartData() {
    try {
        const chartRes = await fetch('/api/orders/daily', { headers: getAuthHeaders() });
        const chartData = await chartRes.json();
        const container = document.getElementById('chart-container');
        container.innerHTML = ''; // Clear existing

        const maxCount = Math.max(...chartData.map(d => d.count), 1);

        chartData.forEach(data => {
            const heightPercent = (data.count / maxCount) * 100;
            
            const wrap = document.createElement('div');
            wrap.className = 'bar-wrap';
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = '0%'; // Start at 0 for animation
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.innerText = data.date;

            wrap.appendChild(bar);
            wrap.appendChild(label);
            container.appendChild(wrap);

            // Animate bar
            setTimeout(() => { bar.style.height = `${heightPercent}%`; }, 100);
        });
    } catch (e) { console.error("Error loading chart", e); }
}

async function loadBooksData() {
    try {
        const res = await fetch('/api/books', { headers: getAuthHeaders() });
        const books = await res.json();
        const tbody = document.querySelector('#books-table tbody');
        tbody.innerHTML = '';

        books.forEach(book => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>$${book.price.toFixed(2)}</td>
                <td>${book.stock}</td>
                <td>
                    <button class="danger-btn" onclick="deleteBook(${book.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error loading books", e); }
}

async function loadOrdersData() {
    try {
        const res = await fetch('/api/orders', { headers: getAuthHeaders() });
        const orders = await res.json();
        const tbody = document.querySelector('#orders-table tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.username}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error loading orders", e); }
}

async function loadUsersData() {
    try {
        const res = await fetch('/api/users', { headers: getAuthHeaders() });
        const users = await res.json();
        const tbody = document.querySelector('#users-table tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error loading users", e); }
}

async function loadReviewsData() {
    try {
        const res = await fetch('/api/reviews', { headers: getAuthHeaders() });
        const reviews = await res.json();
        const tbody = document.querySelector('#reviews-table tbody');
        tbody.innerHTML = '';

        reviews.forEach(r => {
            // Create yellow stars
            const starsHTML = '<span style="color: #FFD700; text-shadow: 0 0 2px rgba(0,0,0,0.2);">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</span>';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${r.book_title}</td>
                <td>${r.username}</td>
                <td>${starsHTML}</td>
                <td>${r.comment}</td>
                <td>${new Date(r.date).toLocaleDateString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error("Error loading reviews", e); }
}

// Modal Logic
const modal = document.getElementById('addBookModal');

function openAddBookModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Add Book Form
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        price: parseFloat(document.getElementById('bookPrice').value),
        stock: parseInt(document.getElementById('bookStock').value)
    };

    try {
        await fetch('/api/books', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        closeModal();
        e.target.reset();
        loadBooksData();
        loadDashboardData();
    } catch (e) { console.error("Error adding book", e); }
});

// Delete Book
async function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            await fetch(`/api/books/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            loadBooksData();
            loadDashboardData();
        } catch (e) { console.error("Error deleting book", e); }
    }
}

// Initial Load
if (document.getElementById('dashboard-section')) {
    // Load User Profile
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            const dropdown = document.getElementById('profileDropdown');
            if (dropdown) {
                dropdown.innerHTML = `
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                `;
            }
            // Update Welcome Name and Full Profile Page
            const pageTitle = document.getElementById('page-title');
            if (pageTitle) {
                pageTitle.innerText = `Welcome, ${user.username}`;
            }

            const profName = document.getElementById('prof-name');
            if (profName) profName.innerText = user.username;
            const profEmail = document.getElementById('prof-email');
            if (profEmail) profEmail.innerText = user.email;
            const profRole = document.getElementById('prof-role');
            if (profRole) profRole.innerText = (user.role || 'Admin').toUpperCase();

        } catch(e) { console.error("Error parsing user data"); }
    } else {
        // Redirect to login if no user
        window.location.href = '/';
    }

    loadDashboardData();
}

// Logout logic
const logoutBtn = document.querySelector('.logout a');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
    });
}
