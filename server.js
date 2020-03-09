const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const router = require('./routes')
const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();
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
  mongoose.connect('mongodb://localhost/conduit');// I removed conduit ask Justin!!!!!!!!!!!
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
const port = process.env.PORT ? process.env.PORT : 3001
// finally, let's start our server...
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
