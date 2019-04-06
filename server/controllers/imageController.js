const path = require('path');
const fs = require('fs');

const { errorMessage, successMessage } = require('../helpers');

const User = require('../models/User');
const Product = require('../models/Product');

const upload = (req, res) => {
    const { type, id } = req.params;

    if(!req.files) {
        return errorMessage(res, 'No file has been selected', 400);
    }

    const validTypes = ['users', 'products'];
    if(!validTypes.includes(type)) {
        return errorMessage(res, `The allowed types are: ${ validTypes.join(',') }`, 400);
    }

    const image = req.files.image;
    const extension = getExtension(image);

    const validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if(!validExtensions.includes(extension)) {
        return errorMessage(res, `The allowed extensions are: ${ validExtensions.join(',') }`, 400);
    }
    
    const fileName = `${ id }.${ extension }`;

    image.mv(`uploads/${ type }/${ fileName }`, err => {
        if(err) {
            return errorMessage(res, err, 500);
        }

        if(type === 'users') {
            updateImageUser(res, id, fileName);
        } else {
            updateImageProduct(res, id, fileName);
        }   
    });
}

const show = (req, res) => {
    const { type, img } = req.params;

    const pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);

    if(fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }
}

const updateImageUser = (res, id, fileName) => {
    User.findByIdAndUpdate(id, { img: fileName }, (err, userDB) => {
        if(err) {
            deleteFile('users', fileName);
            return errorMessage(res, err);
        }

        if(!userDB) {
            deleteFile('users', fileName);
            return errorMessage(res, 'User not Found', 400);
        }

        successMessage(res, 'user', userDB, 'Image updated correctly.');
    })
}

const updateImageProduct = (res, id, fileName) => {
    Product.findByIdAndUpdate(id, { img: fileName }, (err, productDB) => {
        if(err) {
            deleteFile('products', fileName);
            return errorMessage(res, err);
        }

        if(!productDB) {
            deleteFile('products', fileName);
            return errorMessage(res, 'Product not Found', 400);
        }

        successMessage(res, 'product', productDB, 'Image updated correctly.');
    })
}

const deleteFile = (type, fileName) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`);
    if(fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

const getExtension = image => {
    const fileName = image.name.split('.');
    return fileName[fileName.length - 1];
}

module.exports = {
    upload,
    show
}