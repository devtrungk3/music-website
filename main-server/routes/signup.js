const express = require('express');
const { userSignupController } = require('../controllers/signup');
const { signupValidation } = require('../middlewares/signup');
const router = express.Router();

router.post('/signup', signupValidation, userSignupController);

module.exports = router;