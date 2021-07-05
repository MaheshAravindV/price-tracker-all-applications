const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id : {
        type : String,
        require : true
    },
    wishlist : {
        type  : [String]
    }
},{_id : false})

const itemSchema = mongoose.Schema({
    _id : {
        type : String,
        require : true,
        alias : 'URL'
    },
    start_date : {
        type : Date,
        require : true
    },
    history : {
        type : [Number]
    }
},{ _id : false})

module.exports = { userSchema,itemSchema }