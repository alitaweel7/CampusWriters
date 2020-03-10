const mongoose = require('mongoose');
const router = require('express').Router();
const Interview = require("../../models/Interview");

//All Routes from here begin with /api/interviews/ON_THIS_PAGE

//this function takes object with
// {
//   authorId: 12,
//   slug: "the first interview."
// }
router.post('/new', (req, res) => {
  User.findById(req.body.autherId).then(function (user) {
    interview.author = user;
    // interview.title = req.body.title; //optional
    interview.slug = req.body.slug; //optional

    Interview.create({ author: user, slug: req.body.slug, ...req.body }).then(function () {
      console.log(interview);
      return res.json({ interview: interview.toJSONFor(user) })
    });
  }).catch(err => res.json(err));
});

router.get('/interview', (req, res) => {
  Interview.findBySlug(req.body.slug).then((interview) => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create
    if (!interview) { return res.sendStatus(401); }
    return res.json({ interview: interview.toJSONFor(interview) });
  });
});


router.put('/interview', (req, res) => {
  //console.log(req.body);
  Interview.findById(req.body.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    if (typeof req.body.interview.title !== 'undefined') {
      interview.title = req.body.interview.title;
    }

    if (typeof req.body.interview.description !== 'undefined') {
      interview.description = req.body.interview.description;
    }

    if (typeof req.body.interview.body !== 'undefined') {
      interview.body = req.body.interview.body;
    }

    return interview.save().then(function (interview) {
      return res.json({ interview: interview.toJSONFor(user) });
    }).catch(next);

  });
});

router.delete("/delete", (req, res) => {
  Interview.findByIdAndDelete(res.body.id).then(response => {
    res.json(response)
  })
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
  Interview.findBySlug(req.body.slug).then((interview) => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create (use slug or ID)
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