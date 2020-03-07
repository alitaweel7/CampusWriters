var router = require('express').Router();
const users = require("./users");
const profiles = require("./profiles");
const interviews = require("./interviews");

router.use('/users', users);
router.use('/profiles', profiles);
router.use('/interviews', interviews);

router.use((req, res) => {
    res.sendFile(path.join(__dirname + "../../public/index.html"))
})

module.exports = router;
