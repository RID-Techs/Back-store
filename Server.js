const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 9007
const ConnectToDb = require("./Config/DB_Connect")
const Login_Routes = require('./Routes/Login-Routes')

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });

app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(cookieParser())

ConnectToDb()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/auth", Login_Routes)

app.listen(port, () => {
    console.log(`Running on the port ${port}`);
})