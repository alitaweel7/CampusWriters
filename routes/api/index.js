const router = require('express').Router();
const users = require("./users");
const interviews = require("./interviews");
const path = require("path")

//All routes from here begin with /api
router.use('/users', users);
router.use('/interviews', interviews);

router.use((req, res) => {
    res.sendFile(path.join(__dirname + "../../client/build/index.html"))
})

module.exports = router;
