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
	console.log("your search was " + JSON.stringify(search));
	Seed.find({ name : search}, (err, docs) => {
		if (err) return res.send("error");
		else if (docs == null) return "No search found";
		console.log(docs.length);
		console.log(docs);
		return docs;
	}).exec( (err, result) => {
		if (err) return res.send("error");
		else if (result.length == 0) res.send('No results found');
		res.render('result', {result: result, search: search});
	});
	// await result;
	// console.log("result - " + result);
	// res.render('result', {result: result});

});
module.exports = router;
