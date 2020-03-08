const mongoose = require('mongoose');
const router = require('express').Router();
//mongoose.plugin(schema => { schema.options.usePushEach = true });
const User = mongoose.model('User');
const auth = require('../auth');

// All routes from here begin with /api/profiles/*name
router.get('/username', (req, res) => {
  if (req.payload) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) { return res.sendStatus(401); }

      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  }
  else {
    return res.sendStatus(500);
  }
});

router.post('/username/follow', (req, res) => {
  if (req.payload) {
    User.findById(req.payload.followUserId).then(function (followUser) {
      if (!followUser) { return res.sendStatus(401); }

      User.findById(req.payload.followedUserId).then(function (followedUser) {
        if (!followedUser) { return res.sendStatus(401); }

        return followUser.follow(followedUser.id).then(function () {
          return res.json({ profile: req.profile.toProfileJSONFor(followUser) });
        });
      });
    }).catch(next);
  }
  else {
    return res.sendStatus(500);
  }
});

router.delete('/username/follow', (req, res) => {
  const profileId = req.profile._id;

  if (req.payload) {
    User.findById(req.payload.followUserId).then(function (followUser) {
      if (!followUser) { return res.sendStatus(401); }

      User.findById(req.payload.followedUserId).then(function (followedUser) {
        if (!followedUser) { return res.sendStatus(401); }

        return followUser.unfollow(followedUser.id).then(function () {
          return res.json({ profile: req.profile.toProfileJSONFor(followUser) });
        });
      });
    }).catch(next);
  }
  else {
    return res.sendStatus(500);
  }

});

module.exports = router;