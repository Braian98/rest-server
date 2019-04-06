const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const { Schema } = mongoose;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not valid role'
}

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is necessary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is necessary']
    },
    password: {
        type: String,
        required: [true, 'The password is necessary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.statics.generateToken = function(user) {
    return jwt.sign({
        user
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
}

userSchema.statics.verifyTokenGoogle = async function(token) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

userSchema.statics.passwordEncrypted = function(password) {
    return bcrypt.hashSync(password, 10);
}

userSchema.statics.comparePassword = function(password, passwordDB) {
    return bcrypt.compareSync(password, passwordDB);
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be an only one' });

module.exports = mongoose.model('users', userSchema);