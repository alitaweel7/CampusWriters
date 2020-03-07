const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const passport = require('passport')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose');
const router = require('./routes')

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();
app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/conduit');
  mongoose.set('debug', true);
}

app.use(router);

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}


// finally, let's start our server...
app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});
