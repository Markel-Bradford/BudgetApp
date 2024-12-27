const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { toast } = require('react-toastify');

// Register a new user
router.post('/register', async (req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
      }
    try {
        const user = await User.create({name, email});
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: error.message})
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
    }
});

// Get user information
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Respond with user details
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

// Sign in by name and email query
router.get('/login', async (req, res) => {
    const {name, email} = req.query;

    // Handle missing name and email
    if (!name || !email) {
        return res.status(400).json({error: 'Name and email are required.'})
    }

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }
        
    try {
        console.log("Login attempt:", { name, email }); // Log the input data

        // Find user by query of name and email
        const user = await User.findOne({name, email});

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Respond with user details
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error("Error during login:", error); // Log full error details
        res.status(500).json({error: error.message});
    }
})

module.exports = router;