const router = require('express').Router();
const path = require("path")
const api = require("./api");

router.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/static/index.html"))
})

router.use('/api', api);


module.exports = router;
