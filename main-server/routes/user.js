const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const { verifyJWT } = require('../middlewares/jwtVerification');

router.get('/', verifyJWT, userController.getInfo);
router.put('/', verifyJWT, userController.updateInfo);

module.exports = router;