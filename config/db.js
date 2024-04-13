const mongoose = require('mongoose')

const connectDB = async () => {
    // return mongoose.connect('mongodb://localhost/cma')
    return mongoose.connect(process.env.MONGODB_URI)
    .then(()=>console.log('connected to db'))
        .catch((err) => console.log(err))
}
module.exports = connectDB