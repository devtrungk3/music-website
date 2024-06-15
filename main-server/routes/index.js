const express = require('express');
const router = express.Router();

const { verifyJWT } = require('../middlewares/jwtVerification');
const { checkRole } = require('../middlewares/checkRole');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const userRouter = require('./user');
const refreshRouter = require('./refresh');
const artistRouter = require('./artist');
const genreRouter = require('./genre');
const songRouter = require('./song');
const favoriteRouter = require('./favorite');
const playlistRouter = require('./playlist');
const playHistoryRouter = require('./playHistory');

router.get('/helloworld', (req, res) => {
    res.json('hello world');
});

router.use('/auth', loginRouter, signupRouter, refreshRouter);
router.use('/users', verifyJWT, checkRole(['USER']),  userRouter);
router.use('/artists', artistRouter);
router.use('/genres', genreRouter);
router.use('/songs', songRouter);
router.use('/favorites', verifyJWT, checkRole(['USER']), favoriteRouter);
router.use('/playlists', verifyJWT, checkRole(['USER']), playlistRouter);
router.use('/history', verifyJWT, checkRole(['USER']), playHistoryRouter);

router.use(function(err, req, res, next) {
    console.log(err);
    res.status(500).json({
        error: err.errors[0].message,
    });
});

module.exports = router;