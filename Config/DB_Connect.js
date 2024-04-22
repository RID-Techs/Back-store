const mongoose = require('mongoose')

const ConnectToDb = async () => {
    try {
        const connected = await mongoose.connect(process.env.CONNECT_DB)
        console.log("Database Connected Successfully :",
        connected.connection.host,
        connected.connection.name)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = ConnectToDb;