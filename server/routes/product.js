const express = require('express');

const { verifyToken } = require('../middlewares/authentication');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', verifyToken, productController.index);

router.get('/:id', verifyToken, productController.show);

router.get('/search/:query', verifyToken, productController.search);

router.post('/', verifyToken, productController.store);

router.put('/:id', verifyToken, productController.update);

router.delete('/:id', verifyToken, productController.destroy);

module.exports = router;