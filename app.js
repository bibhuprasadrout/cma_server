require("dotenv").config({ path: "./config/config.env" });
const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db.js')
const auth = require("./middlewares/auth.js")
const cors = require('cors')

const app = express();

//middleware
app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

//routes
app.get("/",(req, res) => {
    res.send("Hello world!")
})
// app.get("/protected", auth, (req, res) => {
//     return res.status(200).json({...req.user._doc})
// })
app.use("/api", require("./routes/auth.js"))
app.use("/api", require("./routes/contact.js"))

//server configs

const PORT = process.env.PORT || 8000;
app.listen(PORT, async ()=>{
    try {
        await connectDB();
    } catch (err) {
        console.log(err);
    }
    console.log(`server is running on port : ${PORT}`)
})