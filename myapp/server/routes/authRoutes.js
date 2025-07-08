const express = require('express');
const router = express.Router();

const { test, Testing, loginUser, registerUser, getProfile, HostRide, FindRide, FindMyRides, logoutUser, sendRequest, MyRideRequests, ApproveRequest, DenyRequest, 
        MyRequests, MyDashboardRides, ChatMembers, HostedRides,
        getMyRides} = require('../controls/authController');

// Router methods: GET, POST, PUT, DELETE
router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/hostride', HostRide);
router.post('/findride', FindRide);
router.post('/logout', logoutUser);
router.put('/request', sendRequest);
router.get('/findmyrequest',MyRideRequests);
router.put('/approve-request', ApproveRequest);
router.put('/deny-request', DenyRequest);
router.get('/myrequests', MyRequests)
router.get('mydashboardrides',MyDashboardRides)
router.get('/test/coords', Testing)
router.get('/ride-members', ChatMembers)
router.get('/myhostedrides', HostedRides)
router.get('/myrides', getMyRides)
module.exports = router;
