const mongoose = require('mongoose');
const router = require('express').Router();
const User = require("../../models/User");

// All routes from here begin with /api/users/*name
router.post('/new', (req, res) => {
  console.log(req.body);
  const passwordObject = User.schema.methods.setPassword(req.body.password);

  console.log(passwordObject);
  const user = {
    username: req.body.username,
    email: req.body.email,
    hash: passwordObject.hash,
    salt: passwordObject.salt,
  };

  User.create(user)
    .then(dbUser => res.json("User Added: " + user.username))
    .catch(err => res.status(400).json("Error: " + err))

});

router.post('/login', (req, res) => {
  console.log(req.body);
  User.find()
    .then(users => {
      let returnedUser = null;
      users.forEach(user => {
        if (user.username == req.body.username) {
          console.log("matched usernames");
          if (User.schema.methods.checkPassword(req.body.password, user.salt, user.hash)) {
            console.log("passwordsmatched");
            returnedUser = user;
          }
        }
      })
      returnedUser == null ? res.status(400).json({ data: returnedUser }) : res.json({ data: returnedUser });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/all").get((req, res) => {
  User.find()
    .then(users => res.json({ data: users }))
    .catch(err => res.status(400).json('Error: ' + err));
})


// Since there is no Auth, no Token coming back----------------------
router.get('/user', (req, res) => {
  User.findById(req.body.id).then((user) => {
    if (!user) { return res.sendStatus(401); }
    return res.json({ user: user.toAuthJSON() });
  })
});

router.delete("/delete", (req, res) => {
  User.findByIdAndDelete(req.body.id).then(response => { // deleting the user, can't find byID
    res.json(response)
  })
});

router.put('/user', (req, res) => {
  User.findById(req.body.id).then(function (user) {

    console.log(req.body);
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
    User.updateOne(user)
      .then(user => res.json("User Updated: " + user.toAuthJSON()))
      .catch(err => res.status(400).json("Error: " + err));

  }).catch(err => {
    res.json(err)
    console.log(err)
  });
});

router.post('/follow', (req, res) => {
  console.log(req);
  User.findById(req.body.currentId).then(currentUser => {

    User.findById(req.body.followedId).then(followedUser => {

      currentUser.following.push(followedUser);

      User.update(currentUser)
        .then(response => res.json("Follower added: " + followedUser))
        .catch(err => res.status(400).json("Error: " + err));
    })
      .catch(err => res.status(400).json("Error finding followed user: " + err));
  })
    .catch(err => res.status(400).json("Error finding current user: " + err));
});

router.post('/unfollow', (req, res) => {
  console.log(req);
  User.findById(req.body.currentId).then(currentUser => {

    User.findById(req.body.unfollowedId).then(unfollowedUser => {

      const unfollowedUserIndex = currentUser.following.indexOf(unfollowedUser);
      currentUser.following.splice(unfollowedUserIndex, 1)

      User.update(currentUser)
        .then(response => res.json("Follower removed: " + unfollowedUser))
        .catch(err => res.status(400).json("Error: " + err));
    })
      .catch(err => res.status(400).json("Error finding unfollowed user: " + err));
  })
    .catch(err => res.status(400).json("Error finding current user: " + err));
});

module.exports = router;

