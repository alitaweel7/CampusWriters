const mongoose = require('mongoose');
const router = require('express').Router();
//mongoose.plugin(schema => { schema.options.usePushEach = true });
const User = mongoose.model('User');
const auth = require('../auth');

router.param('username', (req, res, username) => {
  User.findOne({ username: username }).then(function (user) {
    if (!user) { return res.sendStatus(404); }

    req.profile = user;

    return next();
  }).catch(next);
});

router.get('/username', (req, res) => {
  if (req.payload) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }

      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

router.post('/username/follow', (req, res) => {
  const profileId = req.profile._id;

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.follow(profileId).then(function () {
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  }).catch(next);
});

router.delete('/username/follow', (req, res) => {
  const profileId = req.profile._id;

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.unfollow(profileId).then(function () {
      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  }).catch(next);
});

module.exports = router;
