const router = require('express').Router();
const users = require("./users");
const interviews = require("./interviews");
const profiles = require("./profiles"); // added back profiles
const path = require("path")

//All routes from here begin with /api
router.use('/users', users);
router.use('/interviews', interviews);
router.use('/profiles', profiles); //I added back profiles

router.use((req, res) => {
    res.sendFile(path.join(__dirname + "../../client/build/static/index.html"))// I think this is my issue I keep getting errors (ask justin)
})

module.exports = router;
