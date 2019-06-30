var express = require('express');
var router = express.Router();
var Seed = require('../models/seed');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//grabs search
router.get('/search', function(req,res,next) {
	var search = req.query.search;
	// console.log("server/index.js has caught route");
	console.log("your search was " + JSON.stringify(search));
	Seed.find({ name : search}, (err, docs) => {
		if (err) return res.send("error");
		else if (docs == null) return "No search found";
		console.log("returning result");
		console.log(docs[0]);
		return docs;
	}).exec( (err, result) => {
		res.render('result', {result: result});
	});
	// await result;
	// console.log("result - " + result);
	// res.render('result', {result: result});

});
module.exports = router;
