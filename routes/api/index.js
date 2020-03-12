const router = require('express').Router();
const users = require("./users");
const interviews = require("./interviews");
const path = require("path")

//All routes from here begin with /api
router.use('/users', users);
router.use('/interviews', interviews);



module.exports = router;
