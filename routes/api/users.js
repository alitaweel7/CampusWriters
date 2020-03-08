const mongoose = require('mongoose');
const router = require('express').Router();
const Interview = require("../../models").Interview;

// All routes from here begin with /api/users
router.post('/new', (req, res) => {
  const Interview = {
    username: req.body.username,
    email: req.body.email
  }
  Interview.create(user).then((dbUser) => {
    return res.json({ dbUser });
  }).catch(err => {
    res.json(err)
  })
});

router.post('/login', (req, res) => {
  res.json({ success: true })
});

router.route("/all").get((req, res) => {
  Interview.find().then(users => {
    res.json({ data: users })
  })
})

router.get('/user', (req, res) => {
  Interview.findById(req.body.id).then((user) => {
    if (!user) { return res.sendStatus(401); }
    return res.json({ user: user.toAuthJSON() });
  })
});

router.delete("/delete", (req, res) => {
  Interview.findByIdAndDelete(res.body.id).then(response => {
    res.json(response)
  })
});

router.put('/user', (req, res) => {
  Interview.findById(req.body.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    // only update fields that were actually passed...
    if (typeof req.body.user.username !== 'undefined') {
      user.username = req.body.user.username;
    }
    if (typeof req.body.user.email !== 'undefined') {
      user.email = req.body.user.email;
    }
    if (typeof req.body.user.bio !== 'undefined') {
      user.bio = req.body.user.bio;
    }
    if (typeof req.body.user.image !== 'undefined') {
      user.image = req.body.user.image;
    }
    if (typeof req.body.user.password !== 'undefined') {
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function () {
      return res.json({ user: user.toAuthJSON() });
    });
  }).catch(next);
});

module.exports = router;
