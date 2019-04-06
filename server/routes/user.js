const express = require('express');
const { verifyToken, verifyRole } = require('../middlewares/authentication');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/' , verifyToken, userController.index);

router.post('/add', [verifyToken, verifyRole], userController.store);

router.put('/edit/:id', [verifyToken, verifyRole], userController.update);

router.delete('/delete/:id', [verifyToken, verifyRole], userController.destroy);

module.exports = router;