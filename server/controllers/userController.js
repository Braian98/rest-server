const _ = require('underscore');
const { errorMessage, successMessage } = require('../helpers');
const User = require('../models/User');

const index = (req, res) => {
    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to) || 5;

    User.find({ state:true }, 'name email role state google img')
        .skip(from)
        .limit(to)
        .exec((err, users) => {
            if(err) {
                return errorMessage(res, err, 400);
            }

            User.count({ state:true }, (err, cont) => {
                if(err) {
                    return errorMessage(res, err);
                }

                successMessage(res, 'users', users, undefined, null, cont);
            });
        });
}

const store = (req, res) => {
    const { name, email, password, role } = req.body;

    const newUser = new User({
        name,
        email,
        password: User.passwordEncrypted(password),
        role
    });

    newUser.save((err, userDB) => {
        if(err) {
            return errorMessage(res, err, 400);
        }
        
        successMessage(res, 'user', userDB, 'User created correctly!');
    });
}

const update = (req, res) => {
    const { id } = req.params;
    const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, userDB) => {
        if(err) {
            return errorMessage(res, err, 400);
        }

        successMessage(res, 'user', userDB, 'User updated correctly!');
    });
}

const destroy = (req, res) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, { state: false }, { new:true } , (err, userDB) => {
        if(err) {
            return errorMessage(res, err, 400);
        }

        successMessage(res, 'user', userDB, 'User deleted correctly!');
    });
}

module.exports = {
    index,
    store,
    update,
    destroy
}