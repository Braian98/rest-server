const express = require('express');

const imageController = require('../controllers/imageController');

const { verifyToken } = require('../middlewares/authentication');

const router = express.Router();

router.get('/image/:type/:img', verifyToken, imageController.show);

router.put('/upload/:type/:id', verifyToken, imageController.upload);

module.exports = router;