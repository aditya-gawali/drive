const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
        required: [true, "path is required"]
    },
    originalname: {
        type: String,
        required: [true, "OriginalName is required"]
    },
    publicID: {
        type: String,
        required: [true, "public ID is required"]
    },
    size: {
        type: String,
    },
    originalname: {
        type: String,
        required: [true, "OriginalName is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "user is required"]
    }

},
    {
        timestamps: true
    })

const fileModel = mongoose.model('file', fileSchema)

module.exports = fileModel