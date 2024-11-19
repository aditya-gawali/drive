const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim:true,
        lowercase: true,
        unique: true,
        minlength: [3, 'username must be at least 3 char long']
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase: true,
        unique: true,
        minlength: [13, 'Email must be at least 13 char long']
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength: [5, 'password must be at least 5 char long']
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel