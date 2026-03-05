// ============================================
// STEP 2: USER REGISTRATION SYSTEM - BACKEND
// ============================================

// 1. IMPORT PACKAGES
// ============================================
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// 2. CONFIGURE ENVIRONMENT VARIABLES
// ============================================
dotenv.config();

// 3. CREATE EXPRESS APP
// ============================================
const app = express();
// 4. MIDDLEWARE
// ============================================
app.use(cors());                    // Allows React to talk to server
app.use(express.json());             // ✅ THIS MUST BE HERE - Parses JSON
app.use(express.urlencoded({ extended: true })); // Optional, but helpful
// 5. DATABASE CONNECTION
// ============================================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',           // Leave empty if no password for XAMPP
    database: 'user_registration'
});

// 6. CONNECT TO DATABASE
// ============================================
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
    
    // 7. CREATE TABLE IF IT DOESN'T EXIST
    // ============================================
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('❌ Error creating table:', err);
        } else {
            console.log('✅ Users table ready');
        }
    });
});

// 8. TEST ROUTE - Check if server is working
// ============================================
app.get('/', (req, res) => {
    res.send('🚀 Server is running! User Registration API');
});

// Add this right before your POST route
app.use('/api/register', (req, res, next) => {
    console.log('Raw body received');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body data:', req.body);
    next();
});
// 9. REGISTRATION ROUTE - POST /api/register (WITH PASSWORD HASHING)
// ============================================
app.post('/api/register', async (req, res) => {  // ← Added 'async'
    
    // Get data from request body
    const { name, email, password, phone } = req.body;
    
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({ 
            message: 'Name, email and password are required' 
        });
    }
    
    try {
        // 🔐 HASH THE PASSWORD (10 = salt rounds - higher = more secure but slower)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log(`🔐 Password hashed for: ${email}`);
        
        // Insert into database with HASHED password
        const query = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
        
        db.query(query, [name, email, hashedPassword, phone], (err, result) => {
            if (err) {
                // Check if email already exists
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ 
                        message: 'Email already exists' 
                    });
                }
                
                console.error('Database error:', err);
                return res.status(500).json({ 
                    message: 'Database error' 
                });
            }
            
            // Success!
            res.status(201).json({
                message: '✅ User registered successfully (password hashed)',
                userId: result.insertId
            });
        });
        
    } catch (error) {
        console.error('Hashing error:', error);
        res.status(500).json({ 
            message: 'Error processing password' 
        });
    }
});
// 10. GET ALL USERS - GET /api/users
// ============================================
app.get('/api/users', (req, res) => {
    
    const query = 'SELECT id, name, email, phone, created_at FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                message: 'Database error' 
            });
        }
        
        res.json(results);
    });
});

// 11. START SERVER
// ============================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}`);
    console.log(`📍 POST API: http://localhost:${PORT}/api/register`);
    console.log(`📍 GET API: http://localhost:${PORT}/api/users`);
});