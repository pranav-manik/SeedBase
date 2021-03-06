const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
// const mongoosastic = require('mongoosastic')
const elasticsearch = require('elasticsearch');
require('dotenv').config();


//Mongoose
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB connected via Mongoose');
});
var Seed = require('./models/seed');


//elasticsearch
// const elastiClient = new elasticsearch({ node: 'http://localhost:9200' });
const esClient = new elasticsearch.Client({
  node: process.env.ELASTICSEARCH_URI,
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true
});

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Use CORS and File Upload modules here
app.use(cors());
app.use(fileUpload());

app.use('/public', express.static(__dirname + '/public'));

app.use('/', index);


app.post('/upload', (req, res, next) => {
// console.log(req);
let imageFile = req.files.file;

imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, err => {
if (err) {
return res.status(500).send(err);
}

res.json({ file: `public/${req.body.filename}.jpg` });
console.log(res.json);
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
const err = new Error('Not Found');
err.status = 404;
next(err);
});


// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});

module.exports = app;