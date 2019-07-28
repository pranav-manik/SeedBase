var express = require('express');
var router = express.Router();
var Seed = require('../models/seed');
var client = require('../connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeeDBase' });
});


//grabs search
router.get('/search', function(req,res,next) {
	var search = req.query.search;
	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	Seed.find({ name : regex}, (err, docs) => {
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

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
