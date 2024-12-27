const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
    const {name, email} = req.body;
    try {
        const user = await User.create({id, name, email});
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
});

module.exports = router;