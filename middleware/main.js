

module.exports = {
    validateUser: (req, res, next) => {
        const { username, pass1, pass2 } = req.body;
        if (pass1 !== pass2 || pass1.length < 3 || pass2.length > 20 || pass1.length < 3 || pass1.length > 20) {
            res.send({ error: "Password is not valid" })
        }
        else if (username.length < 3 || username.length > 20) {
            res.send({ error: "Username is not valid" })
        } else {
            next()
        }
    },
    validatePost: (req, res, next) => {
        const { image, title, startPrice, endTime } = req.body;
        if (!image.includes('http')) {
            res.send({ error: "Image is not valid" })
        }
        else if (title.length < 20 || title.length > 500) {
            res.send({ error: "Title is not valid" })
        } else if (typeof(startPrice) !== "number") {
            res.send({ error: "Price is not valid" })
        } else if (endTime < Math.round(Date.now()/1000)) {
            res.send({ error: "End time is not valid" })
        }
        else {
            next()
        }
    }
}