const express = require('express')
const app = express();
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
const dotenv = require('dotenv')
const connectToDB = require('./config/db')
const cookieParser = require('cookie-parser')
dotenv.config()


connectToDB()

app.set("view engine", "ejs")
app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}))
app.use('/user', userRouter);
app.use('/', indexRouter);

app.get('/', (req,res)=>{
    res.render("index") 
})

app.listen(3000, ()=>{
    console.log("Server is running on PORT : 3000")
})