const mongoose = require('mongoose')

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

module.exports = itemSchema