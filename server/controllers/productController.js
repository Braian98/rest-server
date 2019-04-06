const { errorMessage, successMessage } = require('../helpers');

const Product = require('../models/Product');

const index = (req, res) => {
    const from = Number(req.query.from) || 0;

    Product.find({ available: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return errorMessage(res, err);
            }

            successMessage(res, 'products', products);
        });
}

const show = (req, res) => {
    const { id } = req.params;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {

            if (err) {
                return errorMessage(res, err);
            }

            if (!productDB) {
                return errorMessage(res, 'The ID is not correct', 400);
            }

            successMessage(res, 'product', productDB);
        });
}

const search = (req, res) => {
    const { query } = req.params;
    const regex = new RegExp(query);

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, productsDB) => {
            if (err) {
                return errorMessage(res, err);
            }

            successMessage(res, 'products', productsDB);
        });
}

const store = (req, res) => {
    const { name, priceUni, description, category } = req.body;
    const { _id } = req.user;

    const newProduct = new Product({
        user: _id,
        name,
        priceUni,
        description,
        category
    });

    newProduct.save((err, productDB) => {

        if (err) {
            return errorMessage(res, err);
        }

        successMessage(res, 'product', productDB, 'Product created correctly');
    });
}

const update = (req, res) => {
    const { id } = req.params;
    const { name, priceUni, description, category } = req.body;

    Product.findByIdAndUpdate(id, { name, priceUni, description, category }, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return errorMessage(res, err);
        }

        if (!productDB) {
            return errorMessage(res, 'The ID is not correct', 400);
        }

        successMessage(res, 'product', productDB, 'Product updated correctly');
    });
}

const destroy = (req, res) => {
    const { id } = req.params;

    Product.findByIdAndUpdate(id, { available: false }, { new: true }, (err, productDB) => {
        if (err) {
            return errorMessage(res, err);
        }

        if (!productDB) {
            return errorMessage(res, 'The ID is not correct', 400);
        }

        successMessage(res, 'product', productDB, 'Product disabled correctly');
    });
}

module.exports = {
    index,
    show,
    search,
    store,
    update,
    destroy
}