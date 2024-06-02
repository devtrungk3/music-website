const express = require('express');
const router = express.Router();

const playHistoryController = require('../controllers/playHistory');
const { verifyJWT } = require('../middlewares/jwtVerification');

router.get('/', verifyJWT , playHistoryController.getHistory);
router.post('/', verifyJWT , playHistoryController.addHistory);

module.exports = router;