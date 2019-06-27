const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://pmanik:M0nG0d@seeds-jwby6.mongodb.net/seedbase?retryWrites=true&w=majority', {useNewUrlParser: true});
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  console.log('MongoDB connected');
});


// Test
var MyModel = mongoose.model('seeds', new Schema({ _id: Schema.Types.ObjectId, name: String }), 'seeds');
MyModel.findOne({}, function(err, data) { console.log(data); });
console.log(MyModel.name)


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