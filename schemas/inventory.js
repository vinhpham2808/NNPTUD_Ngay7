let mongoose = require('mongoose');

let inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product',
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        min: [0, "stock cannot be less than 0"],
        default: 0
    },
    reserved: {
        type: Number,
        min: [0, "reserved cannot be less than 0"],
        default: 0
    },
    soldCount: {
        type: Number,
        min: [0, "soldCount cannot be less than 0"],
        default: 0
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('inventory', inventorySchema);
