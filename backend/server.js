const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors())
app.use(express.json()); // Middleware to parse JSON

// Restrict CORS
const allowedOrigins = ['https://markel-bradford.github.io/BudgetApp', 'http://localhost:5173'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenses', expenseRoutes);

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', 'BudgetApp', 'dist');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(frontendPath, 'index.html'))
    );
}

// Middleware to handle errors
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));