const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: false,
        trim: true
    }
}, {
    timestamps: true,
});
const User = mongoose.model('User', userSchema);
module.exports = User;