const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://umaryusuf:umaryusuf633@ds119374.mlab.com:19374/grid-hack"
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// importing our routes files
const ussdRoutes = require("./api/routes/sms");
const webRoutes = require("./api/routes/web");

// handle CORS issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  );

  if (req.method === "OPTIONS") {
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET'
    );
    return res.status(200).json({});
  }
  next();
});

// routes that should handle our request
app.use('/ussd', ussdRoutes);
app.use('/web', webRoutes);


app.use((req, res, next) => {
  const error = new Error('route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;