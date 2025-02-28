import 'dotenv/config';  //managing configuration secrets like API keys, database credentials, etc.
import express from 'express'; // web application framework for Node.js
import cors from 'cors'; // middleware that can be used to enable CORS with various options
import { pool, connectDB } from './db/conn.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', async (req, res) => {
try {
        const result = await pool.query('SELECT NOW()');
    res.json({ message: 'API is working!', timestamp: result.rows[0].now });
} catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add routes for serving React app
// app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Catch-all route for React router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(5002, () => {console.log(`Server is running on port 5002`);});// Start server