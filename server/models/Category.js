const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },
    user: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('categories', categorySchema);