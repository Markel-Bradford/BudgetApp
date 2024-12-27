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
            toast.error("Email already exists!")
            return res.status(400).json({ error: 'Email already exists.' });
        }
    }
});

module.exports = router;