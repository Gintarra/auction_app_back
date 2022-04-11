const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const auctionDb = require('./models/AuctionSchema')
const schedule = require('node-schedule')

require('dotenv').config()

app.use(express.json())
app.listen(4000)

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

mongoose.connect(process.env.MONGO_KEY)
    .then(res => {
        console.log('connection good')
    }).catch(e => {
        console.log(e)
    })


let allAuctions = []




// async function all() {
//     allAuctions = await auctionDb.find({ active: true }, {new: true})
//     console.log(allAuctions)
//    // console.log(Math.round(Date.now()/1000))
//     const startTime = (Math.round(Date.now() / 1000))
//     allAuctions.map(x => schedule.scheduleJob({ start: startTime*1000, end: x.endTime*1000, rule: '*/1 * * * * *' },
//         async function () {
//             console.log((Math.round(Date.now() / 1000)), "date now")
//             console.log(x.endTime, "date end")
//             if (Math.round(Date.now() / 1000) >= x.endTime) {
//                 let xMap = x;
//                 console.log(x.endTime)
//                 let aucUpdate = await auctionDb.findOneAndUpdate({ _id: xMap._id },
//                     { $set: { active: false } }, { new: true })

//                 console.log(aucUpdate, "atnaujintas aukcionas")
//                 let owner = await userDb.findOneAndUpdate({ username: aucUpdate.ownerName }, { $inc: { money: aucUpdate.price } }, { new: true })
//                 console.log(owner, "savininkas")
//                 let winUser = await userDb.findOneAndUpdate({ username: aucUpdate.bids[aucUpdate.bids.length - 1].username }, { $inc: { money: -aucUpdate.price } })
//                 winUser = await userDb.findOneAndUpdate({ username: aucUpdate.ownerName }, { $inc: { reservedMoney: -aucUpdate.price } })
//                 let loggedUser = await userDb.findOne({ username: req.session.user })

//                 const allAuctionsNew = await auctionDb.find({})
//                 // return res.send({ success: true, data: allAuctionsNew, data2: loggedUser })
//                 // return
//             }

//         }))
// }

 //all()
// async function newf () {
//      const startTime = (Date.now() + 5000);
//     const endTime = (startTime + 10000);
//     const arrayNew = await auctionDb.find({ active: true })
//      arrayNew.map(x=> schedule.scheduleJob({ start: (Date.now()), end: endTime, rule: '*/1 * * * * *' }, function () {
//       console.log(new Date(Date.now()))
//         console.log(endTime, "endTime")
//         if ((Date.now()) >= (startTime + 5000)) {
//             console.log('Time for tea!');
//         }

//     }))
// }

// newf()







const router = require('./routes/main')
app.use('/', router)