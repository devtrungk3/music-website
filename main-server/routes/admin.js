const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

router.get('/statistics', adminController.statistics);
router.get('/users', adminController.getUsers);
router.get('/user-statistics', adminController.userStatistics);

module.exports = router;