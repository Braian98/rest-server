const { errorMessage, successMessage } = require('../helpers');

const Category = require('../models/Category');

const index = (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return errorMessage(res, err);
            }

            successMessage(res, 'categories', categories);
        });
}

const show = (req, res) => {
    const { id } = req.params;

    Category.findById(id)
            .populate('user', 'name email')
            .exec((err, categoryDB) => {
                if (err) {
                    return errorMessage(res, err);
                }
        
                if (!categoryDB) {
                    return errorMessage(res, 'The ID is not correct');
                }
        
                successMessage(res, 'category', categoryDB);
            });
}

const store = (req, res) => {
    const { description } = req.body;
    const { _id } = req.user;

    const newCategory = new Category({
        description,
        user: _id
    });

    newCategory.save((err, categoryDB) => {
        if (err) {
            return errorMessage(res, err);
        }

        successMessage(res, 'category', categoryDB, 'Category created correctly');
    });
}

const update = (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    Category.findByIdAndUpdate(id, { description }, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return errorMessage(res, err);
        }

        if (!categoryDB) {
            return errorMessage(res, 'The ID is not correct', 400);
        }

        successMessage(res, 'category', categoryDB, 'Category updated correctly');
    });
}

const destroy = (req, res) => {
    const { id } = req.params;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if (err) {
            return errorMessage(res, err);
        }

        if (!categoryDB) {
            return errorMessage(res, 'The ID is not correct', 400);
        }

        successMessage(res, 'category', categoryDB, 'Category deleted correctly');
    });
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
}