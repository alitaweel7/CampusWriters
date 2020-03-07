const router = require('express').Router();
const path = require("")
const api = require("./api");


router.use('/api', require);

router.use((req, res) => {
    res.sendFile(path.join(__dirname + "../public/index.html"))
})
module.exports = router;
