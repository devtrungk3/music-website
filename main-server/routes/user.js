const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/', userController.getInfo);
router.put('/', userController.updateInfo);

module.exports = router;