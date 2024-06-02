const express = require('express');
const { userLoginController } = require('../controllers/login');
const { loginValidation } = require('../middlewares/login');
const router = express.Router();

router.post('/login', loginValidation, userLoginController);
module.exports = router;