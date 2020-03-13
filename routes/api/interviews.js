const mongoose = require('mongoose');
const router = require('express').Router();
const Interview = require("../../models/Interview");
const User = require('../../models/User');

//All Routes from here begin with /api/interviews/ON_THIS_PAGE

//this function takes object with
// {
//   authorId: 12,
//   slug: "the first interview."
// }

router.post('/new', (req, res) => {
  User.findById(req.body.authorId).then(function (user) {

    const interview = {
      slug: req.body.title + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36),
      author: user,
      title: req.body.title,
      description: req.body.description,
      body: req.body.body,
      tagList: req.body.tagList
    };

    console.log(interview);

    Interview.create(interview)
      .then(returnedInterview => {
        console.log(returnedInterview);
        // console.log("returned Interview: " + returnedInterview.title);
        res.json("Interview Added: " + returnedInterview.title)
      })
      .catch(err => res.status(400).json("Error: " + err))

  }).catch(err => res.status(400).json("Error: " + err))

});


router.post('/getAll', (req, res) => {
  var interviewListToReturn = [];
  User.findById(req.body.userId)
    .then(user => {
      Interview.find().then(interviewList => {
        interviewList.forEach(interview => {
          console.log(interview.author._id, user._id);
          if (interview.author._id.toString() === user._id.toString()) {
            console.log('adding to list');
            interviewListToReturn.push(interview);
          }
        });
        console.log(interviewListToReturn)
        res.json({ data: interviewListToReturn });

      })
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});


router.get('/interview', (req, res) => {

  Interview.findById(req.body.id)
    .then(interview => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create
      res.json({ data: interview });
    })
    .catch(err => res.status(400).json("Error: " + err));
});


router.put('/interview', (req, res) => {
  Interview.findById(req.body.id).then(function (interview) {

    if (typeof req.body.interview.title !== 'undefined') {
      interview.title = req.body.interview.title;
    }

    if (typeof req.body.interview.description !== 'undefined') {
      interview.description = req.body.interview.description;
    }

    if (typeof req.body.interview.body !== 'undefined') {
      interview.body = req.body.interview.body;
    }

    Interview.update(interview)
      .then(interview => res.json("Interview updated " + interview))
      .catch(err => res.status(400).json("Error: " + err));

  })
    .catch(err => res.status(400).json("Error: " + err))
});

router.delete("/delete", (req, res) => {
  Interview.findByIdAndDelete(req.body.id)
    .then(response => {
      res.json(response)
    })
    .catch(err => res.status(400).json("Error: " + err));

});


router.post('/interview/favorite', (req, res, next) => {
  const interviewId = req.interview._id;

  Interview.findById(req.body.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    return user.favorite(interviewId).then(function () {
      return req.interview.updateFavoriteCount().then(function (interview) {
        return res.json({ interview: interview.toJSONFor(user) });
      });
    });
  }).catch(next);
});

router.delete('/interview/favorite', (req, res, next) => {
  const interviewId = req.interview._id;

  Interview.findById(req.body.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    return Interview.unfavorite(interviewId).then(function () {
      return req.interview.updateFavoriteCount().then(function (interview) {
        return res.json({ interview: interview.toJSONFor(user) });
      });
    });
  }).catch(next);
});

router.post('/interview/comments', (req, res, next) => {
  Interview.findById(req.body.interviewId).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    User.findById(req.body.userId).then(function (user) {
      if (!user) { return res.sendStatus(401); }


      const comment = new Comment(req.body.comment);
      comment.interview = req.interview;
      comment.author = user;

      return comment.save().then(function () {
        req.interview.comments.push(comment);

        return req.interview.save().then(function (saveInterview) {
          res.json({ comment: comment.toJSONFor(user) });
        });
      });
    });
  }).catch(next);
});

router.get('/interview/comments', (req, res, next) => {
  Interview.findById(req.body.id).then((interview) => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create (use slug or ID)
    if (!interview) { return res.sendStatus(401); }
    return res.json({ comments: interview.comments.toJSONFor(interview) });
  });
});

router.delete('/interview/comments/comment', (req, res) => {
  if (req.comment.author.toString() === req.body.id.toString()) {
    req.interview.comments.remove(req.comment._id);
    req.interview.save().then(Comment.find({ _id: req.comment._id }).remove().exec())
      .then(function () {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;