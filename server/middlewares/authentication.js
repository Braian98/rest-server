const jwt = require('jsonwebtoken');

const { errorMessage } = require('../helpers');

const verifyToken = (req, res, next) => {
    const token = req.get('token') || req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err) {
            return errorMessage(res, err, 401);
        }
        req.user = decoded.user;
        next();
    });
}

const verifyRole = (req, res, next) => {
    const { role } = req.user;

    if(role === 'ADMIN_ROLE') {
        next();
    } else {
        return errorMessage(res, 'You do not have permissions', 401);
    }
}

module.exports = {
    verifyToken,
    verifyRole
}