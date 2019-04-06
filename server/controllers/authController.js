const User = require('../models/User');

const { errorMessage, successMessage } = require('../helpers');

const login = (req, res) => {
    const { email, password } = req.body;
    
    User.findOne({ email }, (err, userDB) => {
        if(err) {
            return errorMessage(res, err);
        }

        if(!userDB) {
            return errorMessage(res, 'User not found', 400);
        }

        if(!User.comparePassword(password, userDB.password)) {
            return errorMessage(res, 'Incorrect Password', 400);
        }

        const token = User.generateToken(userDB);

        successMessage(res, 'user', userDB, 'The user has successfully logged in', token);
        
    });
}

const loginWithGoogle = async (req, res) => {
    const { idtoken } = req.body;

    const googleUser = await User.verifyTokenGoogle(idtoken)
                        .catch(err => errorMessage(res, err, 403));
    
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if(err) {
            return errorMessage(res, err);
        }

        if(userDB) {
            if(userDB.google === false) {
                return errorMessage(res, 'You must use your normal authentication', 400);
            }

            const token = User.generateToken(userDB);

            return successMessage(res, 'user', userDB, 'The user has successfully logged in', token);
            
        } else {
            const newUser = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });

            newUser.save( (err, userDB) => {
                if(err) {
                    return errorMessage(res, err);
                }

                const token = User.generateToken(userDB);
    
                return successMessage(res, 'user', userDB, 'The user has successfully logged in', token);
            });
        }
    });
}

module.exports = {
    login,
    loginWithGoogle
}