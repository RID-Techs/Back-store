const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const port = process.env.PORT || 9007
const ConnectToDb = require("./Config/DB_Connect")
const Login_Routes = require('./Routes/Login-Routes')

app.use(cors())
ConnectToDb()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/auth", Login_Routes)

app.listen(port, () => {
    console.log(`Running on the port ${port}`);
})