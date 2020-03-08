const mongoose = require('mongoose');
const router = require('express').Router();
const Interview = require("../../models").Interview


//this function takes object with
// {
//   authorId: 12,
//   slug: "the first interview."
// }
//All Routes from here begin with /api/interviews/ON_THIS_PAGE
router.post('/new', (req, res) => {
  const interview = new Interview();

  User.findById(req.payload.autherId).then(function (user) {
    interview.author = user;
    // interview.title = req.payload.title; //optional
    interview.slug = req.payload.slug; //optional

    return interview.save().then(function () {
      console.log(interview);
      return res.json({ interview: interview.toJSONFor(user) })
    });
  }).catch(next);
});

router.get('/interview', (req, res) => {
  Interview.findBySlug(req.payload.slug).then((interview) => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create
    if (!interview) { return res.sendStatus(401); }
    return res.json({ interview: interview.toJSONFor(interview) });
  });
});

//---------- or ('interview') after put?
router.put('/interview', (req, res) => {
  Interview.findById(req.body.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    if (typeof req.body.interview.title !== 'undefined') {
      interview.title = req.body.interview.title; //req. from the start
    }

    if (typeof req.body.interview.description !== 'undefined') {
      interview.description = req.body.interview.description; //req. from the start
    }

    if (typeof req.body.interview.body !== 'undefined') {
      interview.body = req.body.interview.body; //req. from the start
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

//router.delete('/interview', (req, res) => {
//User.findById(req.payload.id).then(function () {
//if (req.interview.author._id.toString() === req.payload.id.toString()) {
//return req.interview.remove().then(function () {
//return res.sendStatus(204);
//});
//} else {
//return res.sendStatus(403);
//}
//});
//});

router.post('/interview/favorite', (req, res) => {
  const interviewId = req.interview._id;

  Interview.findById(req.payload.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    return user.favorite(interviewId).then(function () {
      return req.interview.updateFavoriteCount().then(function (interview) {
        return res.json({ interview: interview.toJSONFor(user) });
      });
    });
  }).catch(next);
});

router.delete('/interview/favorite', (req, res) => {
  const interviewId = req.interview._id;

  Interview.findById(req.payload.id).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    return Interview.unfavorite(interviewId).then(function () {
      return req.interview.updateFavoriteCount().then(function (interview) {
        return res.json({ interview: interview.toJSONFor(user) });
      });
    });
  }).catch(next);
});

router.post('/interview/comments', (req, res) => {
  Interview.findById(req.payload.interviewId).then(function (interview) {
    if (!interview) { return res.sendStatus(401); }

    User.findById(req.payload.userId).then(function (user) {
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

router.get('/interview/comments', (req, res) => {
  Interview.findBySlug(req.payload.slug).then((interview) => {   //depeding on whether we are finding the interview by MongoDBs ID, or the slug that we create
    if (!interview) { return res.sendStatus(401); }
    return res.json({ comments: interview.comments.toJSONFor(interview) });
  });
});

// router.param('comment', (req, res, id) => {
//   Comment.findById(id).then(function (compament) {
//     if (!comment) { return res.sendStatus(401); }

//     req.comment = comment;

//     return next();
//   }).catch(next);
// });

router.delete('/interview/comments/comment', (req, res) => {
  if (req.comment.author.toString() === req.payload.id.toString()) {
    req.interview.comments.remove(req.comment._id);
    req.interview.save().then(Comment.find({ _id: req.comment._id }).remove().exec())
      .then(function () {
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

// router.get('/', (req, res) => {
//   const query = {};
//   const limit = 20;
//   const offset = 0;

//   if (typeof req.query.limit !== 'undefined') {
//     limit = req.query.limit;
//   }

//   if (typeof req.query.offset !== 'undefined') {
//     offset = req.query.offset;
//   }

//   if (typeof req.query.tag !== 'undefined') {
//     query.tagList = { "$in": [req.query.tag] };
//   }

//   Promise.all([
//     req.query.author ? User.findOne({ username: req.query.author }) : null,
//     req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
//   ]).then(function (results) {
//     const author = results[0];
//     const favoriter = results[1];

//     if (author) {
//       query.author = author._id;
//     }

//     if (favoriter) {
//       query._id = { $in: favoriter.favorites };
//     } else if (req.query.favorited) {
//       query._id = { $in: [] };
//     }

//     return Promise.all([
//       Interview.find(query)
//         .limit(Number(limit))
//         .skip(Number(offset))
//         .sort({ createdAt: 'desc' })
//         .populate('author')
//         .exec(),
//       Interview.count(query).exec(),
//       req.payload ? User.findById(req.payload.id) : null,
//     ]).then(function (results) {
//       const interviews = results[0];
//       const interviewsCount = results[1];
//       const user = results[2];

//       return res.json({
//         interviews: interviews.map(function (interview) {
//           return interview.toJSONFor(user);
//         }),
//         interviewsCount: interviewsCount
//       });
//     });
//   }).catch(next);
// });

// router.param('interview', (req, res, slug) => {
//   Interview.findOne({ slug: slug })
//     .populate('author')
//     .then(function (interview) {
//       if (!interview) { return res.sendStatus(404); }

//       req.interview = interview;
//       interview.comments = interview.comments || [];

//       return next();
//     }).catch(next);
// });

module.exports = router;