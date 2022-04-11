const bcrypt = require('bcrypt')
const userDb = require('../models/UserSchema2')
const auctionDb = require('../models/AuctionSchema')





module.exports = {
    register: async (req, res) => {
        const { username, pass1, pass2 } = req.body
        const userExists = await userDb.findOne({ username })
        if (userExists) return res.send({ success: false, error: "Username is taken" })

        const hash = await bcrypt.hash(pass1, 10)
        const user = new userDb()
        user.username = username
        user.pass = hash
        user.image = "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
        user.money = 1000
        user.reservedMoney = 0
        user.save().then(res => {
            console.log('user saved');
        })
        return res.send({ success: true })

    },
    login: async (req, res) => {
        const { username, pass } = req.body
        const userExist = await userDb.findOne({ username: username })

        if (!userExist) {
            res.send({ success: false, message: 'Bad credentials' })
        } else {
            const compare = await bcrypt.compare(pass, userExist.pass)
            if (username === userExist.username && compare) {
                req.session.user = username 
                return res.send({ success: true, data: userExist })
            } else {
                res.send({ success: false, message: 'Bad credentials' })
            }
        }
    },
    userProfile: async (req, res) => {
        const userExist = await userDb.findOne({ username: req.session.user })
        if (!userExist) {
            res.send({ success: false, message: "User not found" })
        } else {
            res.send({ success: true, data: userExist })
        }
    },
    create: async (req, res) => {
        const { image, title, startPrice, endTime } = req.body;
        if (req.session.user) {
            const post = new auctionDb()
            post.ownerName = req.session.user
            post.image = image
            post.title = title
            post.price = startPrice
            post.endTime = endTime
            post.active = true
            post.save().then(res => {
            })
            return res.send({ success: true, data: post })
        }
        res.send({ success: false, error: "User is not logged in" })
    },
    allAuctions: async (req, res) => {
        const posts = await auctionDb.find({})
        if (posts) {
            return res.send({ success: true, data: posts })
        } else {
            res.send({ success: false, error: "nera aukcionu" })
        }
    },
    auction: async (req, res) => {
        const { id } = req.params
        const one = await auctionDb.findOne({ _id: id })
        if (one) {
            return res.send({ success: true, data: one })
        } else {
            res.send({ success: false, error: "nera aukcionu" })
        }
    },
    makeBid: async (req, res) => {
        const { amount, auctionId, timeBid } = req.body
        const logUser = await userDb.findOne({ username: req.session.user })
        const one = await auctionDb.findOne({ _id: auctionId })
        const oneBid = {
            username: req.session.user,
            price: amount,
            time: timeBid
        }
        if (logUser.money - logUser.reservedMoney < amount) {
            return res.send({ success: false, error: "money per mazai" })
        }
        if (req.session.user && one) {
            if (one.price < Number(amount)) {
                let aucUpdate;
                let logUser = await userDb.findOneAndUpdate({ username: req.session.user },
                    { $inc: { reservedMoney: amount } }, { new: true })
                if (one.bids.length > 0) {
                    let lastUser = await userDb.findOne({ username: one.bids[one.bids.length - 1].username })
                    if (lastUser.username === logUser.username) {
                        logUser = await userDb.findOneAndUpdate({ username: one.bids[one.bids.length - 1].username }, { $inc: { reservedMoney: -Number(one.bids[one.bids.length - 1].price) } }, { new: true })
                    } else {
                        let upd = await userDb.findOneAndUpdate({ username: lastUser.username }, { $inc: { reservedMoney: -Number(one.bids[one.bids.length - 1].price) } }, { new: true })
                    }
                    aucUpdate = await auctionDb.findOneAndUpdate({ _id: auctionId },
                        { $push: { bids: oneBid } }, { new: true })
                    aucUpdate = await auctionDb.findOneAndUpdate({ _id: auctionId },
                        { $set: { price: amount } }, { new: true })

                } else {
                    aucUpdate = await auctionDb.findOneAndUpdate({ _id: auctionId },
                        { $push: { bids: oneBid } }, { new: true })
                    aucUpdate = await auctionDb.findOneAndUpdate({ _id: auctionId },
                        { $set: { price: amount } }, { new: true })
                }
                return res.send({ success: true, data: aucUpdate, data2: logUser })
            }
        }
        res.send({ success: false, error: "Auction not found" })
    },
    bidEnd: async (req, res) => {
        const { id, active } = req.body
        if (active && id) {
            let aucUpdate = await auctionDb.findOneAndUpdate({ _id: id },
                { $set: { active: false } }, { new: true })
            if (aucUpdate.bids.length > 0) {
                let owner = await userDb.findOneAndUpdate({ username: aucUpdate.ownerName }, { $inc: { money: aucUpdate.price } }, { new: true })
                let winUser = await userDb.findOneAndUpdate({ username: aucUpdate.bids[aucUpdate.bids.length - 1].username }, { $inc: { money: -aucUpdate.price } })
                winUser = await userDb.findOneAndUpdate({ username: aucUpdate.bids[aucUpdate.bids.length - 1].username }, { $inc: { reservedMoney: -aucUpdate.price } })
                let loggedUser = await userDb.findOne({ username: req.session.user })
                const allAuctionsNew = await auctionDb.find({})
                return res.send({ success: true, data: allAuctionsNew, data2: loggedUser })
            } else {
                return res.send({ success: false, data: "No one bids" })
            }
        }
        res.send({ success: false, data: "No one bids" })
    },
    logout: (req, res) => {
        req.session.user = null
        res.send({ success: true })
    }
}