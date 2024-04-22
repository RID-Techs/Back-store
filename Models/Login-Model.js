const mongoose = require('mongoose')
const Uniq_Validator = require('mongoose-unique-validator')

const UserSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
}, {
    timestamps: true
})

UserSchema.plugin(Uniq_Validator)

module.exports = mongoose.model('users', UserSchema)