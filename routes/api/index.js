var router = require('express').Router();
const users = require("./users");
const profiles = require("./profiles");
const interviews = require("./interviews");

router.use('/users', users);
router.use('/profiles', profiles);
router.use('/interviews', interviews);


module.exports = router;
