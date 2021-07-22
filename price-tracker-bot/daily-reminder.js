if(process.env.NODE_ENV === 'development') require('dotenv').config()

const http = require('http')

const Discord = require('discord.js')
const client = new Discord.Client()
client.login(process.env.BOT_TOKEN)

const ImageCharts = require('image-charts');

const mongoose = require('mongoose')

const { userSchema,itemSchema } = require('./schema')
const User = mongoose.model('User',userSchema)

mongoose.connect(`mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
{ useUnifiedTopology: true, useNewUrlParser: true },
(err)=>{
    if(err) console.log(err)
    else console.log('Connection to DB successful!')
})

var itemRes

client.on('ready',()=>{
    User.find((err,users)=>{
        if(err) console.log(err)
        users.map(async user=>{
            const currentuser = await client.users.fetch(user._id)
            user.wishlist.map(urlreq => {
                const postData = JSON.stringify({ url : urlreq })
                const options = {
                    baseUrl : 'http://localhost',
                    port : 5000,
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Content-Length' : Buffer.byteLength(postData)
                    }
                }
                const req = http.request(options, res => {
                    var data = ''
                    res.setEncoding('utf8');
                    res.on('data', chunk => {
                        data += chunk
                    })
                    res.once('end',()=>{
                        itemRes = JSON.parse(data)
                        currentuser.send(itemRes._id)
                        data = 't:'
                        itemRes.history.map( price => data += price + ',')
                        const maxPrice = Math.max(...itemRes.history)*1.5
                        chds = '0,'+maxPrice
                        chxr = '1,0,'+maxPrice
                        console.log(data)
                        const graph = ImageCharts().cht('lc').chd(data).chs('400x400').chxt('x,y').chds(chds).chxr(chxr)
                        currentuser.send(graph.toURL())
                    })
                })
                req.write(postData)
            })
        })        
    })
})
