const mongoose = require('mongoose')

async function connectToDB() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("connected to DB")
    })
}

module.exports = connectToDB;