const express = require('express');
const router = express.Router();

const playHistoryController = require('../controllers/playHistory');

router.get('/', playHistoryController.getHistory);
router.post('/', playHistoryController.addHistory);

module.exports = router;