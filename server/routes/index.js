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
	var result_size = 200;
	var query = {
        "dis_max" : {
            "queries" : [
                { "fuzzy" : { "variety" : search }},
                { "fuzzy" : { "name" : search }},
                { "fuzzy" : { "category" : search }},

            ],
            "tie_breaker" : 0.7
        }
    }
	//Mongoose search
	// const regex = new RegExp(escapeRegex(req.query.search), 'gi');
	// Seed.find({ name : regex}, (err, docs) => {
	// 	if (err) return res.send("error");
	// 	else if (docs == null) return "No search found";
	// 	console.log(docs.length);
	// 	console.log(docs);
	// 	return docs;
	// }).exec( (err, result) => {
	// 	if (err) return res.send("error");
	// 	else if (result.length == 0) res.send('No results found');
	// 	res.render('result', {result: result, search: search});
	// });

	// Elastic Search
	Seed.esSearch({
		from: 0,
		size: result_size,
		query: query
	}, function (err, seedss) {
	    if (err) {
	        //Handle error
	    }

		try{
			var results = seedss.hits.hits;
		} catch(error){
			console.log(error);
		}

	    //work with your hits
	    console.log(results);
	    res.json(results);
	});




});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
