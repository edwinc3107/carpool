const express = require('express');
const router = express.Router();

const { test, loginUser, registerUser, getProfile, HostRide, FindRide, FindMyRides } = require('../controls/authController');

// Router methods: GET, POST, PUT, DELETE
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/hostride', HostRide);
router.post('/findride', FindRide);
router.get('/findmyride', FindMyRides)

module.exports = router;
