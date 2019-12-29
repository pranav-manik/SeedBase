var express = require('express');
var router = express.Router();
var Seed = require('../models/seed');
var Queries = require('../helpers/query');
var client = require('../connection');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SeeDBase' });
});


//grabs search
router.get('/search', function(req,res,next) {
	var search = req.query.search;
	var search_array = search.split(" ");
	var result_size = 200;

	var query = Queries.generateQuery(search);

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
