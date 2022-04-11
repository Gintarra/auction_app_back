const express = require('express')
const router = express.Router()


const { register, login, userProfile, create,
    allAuctions, auction, makeBid, bidEnd, logout }
    = require('../controllers/main')

const {validateUser, validatePost} = require('../middleware/main')

router.post('/register', validateUser, register)
router.post('/login', login)
router.get('/profile', userProfile)
router.post('/create', validatePost, create )
router.get('/all-auctions', allAuctions)
router.get('/auction/:id', auction)
router.post('/bid', makeBid)
router.post('/bidEnd', bidEnd)



router.get('/logout', logout)


module.exports = router