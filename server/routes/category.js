const express = require('express');

const { verifyToken, verifyRole } = require('../middlewares/authentication');

const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', verifyToken, categoryController.index);

router.get('/:id', verifyToken, categoryController.show);

router.post('/', verifyToken, categoryController.store);

router.put('/:id', verifyToken, categoryController.update);

router.delete('/:id', [verifyToken, verifyRole], categoryController.destroy);

module.exports = router;