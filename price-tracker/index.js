const express = require('express')
const mongoose = require('mongoose')
const https = require('https')

const AWS = require('aws-sdk')
AWS.config.update({'region' : 'ap-south-1'})
const lambda = new AWS.Lambda()

const updatePrices = require('./updatePrices')
const Cronjob = require('cron').CronJob
new Cronjob('0 0 0 * * *',updatePrices)

if(process.env.NODE_ENV === 'development') require('dotenv').config()

const itemSchema = require('./schema')
const Item = mongoose.model('Item',itemSchema)

const app = express()
const PORT = process.env.PORTAPI

mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
{ useUnifiedTopology: true, useNewUrlParser: true },
(err)=>{
    if(err) console.log(err)
    else console.log('Connection to DB successful!')
})

app.listen(PORT)
app.use(express.json())

app.use(express.static('./static'))
app.get('/',(req,res)=>{
    res.sendFile('/static/docs.html',{root : __dirname})
})

app.post('/',async(req,res)=>{

    const id = req.body.url

    const lambdaParams = {
        FunctionName : 'getPrice',
        Payload : JSON.stringify({
            'url' : id
        })
    }

    try{
        let item = await Item.findById(id)
        if(!item){
            price = (await lambda.invoke(lambdaParams).promise()).Payload
            item = new Item({
                _id : id,
                start_date : Date.now(),
                history : [price]
            })
            await item.save()
        }
        res.send(item).status(200)
    }
    catch(err){
        res.send(err.message).status(400)
    }  
})
