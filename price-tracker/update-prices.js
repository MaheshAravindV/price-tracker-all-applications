const mongoose = require('mongoose')

if(process.env.NODE_ENV === 'development') require('dotenv').config()

const AWS = require('aws-sdk')
AWS.config.update({'region' : 'ap-south-1'})
const lambda = new AWS.Lambda()

mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
{ useUnifiedTopology: true, useNewUrlParser: true })

const itemSchema = require('./schema')
const Item = mongoose.model('Item',itemSchema)

async function updatePrices(){
    console.log('Prices being updated!')
    Item.find((err,items)=>{
        if(err) console.log(err)
        else{
            items.map(async(item)=>{
                const lambdaParams = {
                    FunctionName : 'getPrice',
                    Payload : JSON.stringify({
                        'url' : item._id
                    })
                }
                const price = (await lambda.invoke(lambdaParams).promise()).Payload
                item.history.push(price)
                item.save()
            })
            console.log('Updated prices on ',new Date())
        }
    })
}
module.exports = updatePrices