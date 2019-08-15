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
	var search_array = search.split(" ");
	var result_size = 200;
	//if searching 1 word
	if (search_array.length == 1)
	{
		var query = {
	        "dis_max" : {
	            "queries" : [
	                { 
	                	"fuzzy" : { 
	                		"variety" : {
			                    "value": search,
			                    "boost": 1.0,
								"fuzziness": 2,
								"prefix_length": 2,
								"max_expansions": 20
			                 }
	            		}
	            	},
	                { 
	                	"fuzzy" : { 
	                		"name" : {
			                    "value": search,
			                    "boost": 1.0,
								"fuzziness": 2,
								"prefix_length": 2,
								"max_expansions": 20
			                 }
	            		}
	            	},
	                { 
	                	"fuzzy" : { 
	                		"category" : {
			                    "value": search,
			                    "boost": 1.0,
								"fuzziness": 2,
								"prefix_length": 2,
								"max_expansions": 20
			                 }
	            		}
	            	}

	            ],
	            "tie_breaker" : 0.7
	        }
	    }
	}


	//if search query is more than 1 word
	else if (search_array.length > 1)
	{
		//clause for variety
		var search_variety_clause = [];
		search_array.forEach( (word) => {
			clause = {
	          "span_multi": {
	            "match": {
	              "fuzzy": {
	                "variety": {
	                  "fuzziness": "2",
	                  "value": word
	                }
	              }
	            }
	          }
	        }
			search_variety_clause.push(clause);
		});
		// clause for name
		var search_name_clause = [];
		search_array.forEach( (word) => {
			clause = {
	          "span_multi": {
	            "match": {
	              "fuzzy": {
	                "name": {
	                  "fuzziness": "2",
	                  "value": word
	                }
	              }
	            }
	          }
	        }
			search_name_clause.push(clause);
		});
		// clause for category
		var search_category_clause = [];
		search_array.forEach( (word) => {
			clause = {
	          "span_multi": {
	            "match": {
	              "fuzzy": {
	                "category": {
	                  "fuzziness": "2",
	                  "value": word
	                }
	              }
	            }
	          }
	        }
			search_category_clause.push(clause);
		});

		var query = {
		    "dis_max" : {
				"queries" : [
					{
						"span_near": {
							"clauses": search_variety_clause,
							"slop": 1,
							"in_order": "true"
				    	}
				  	},
					{
				    	"span_near": {
					      	"clauses": search_name_clause,
					      	"slop": 1,
					      	"in_order": "true"
					    }
					  },
					{
				    	"span_near": {
					      	"clauses": search_category_clause,
					      	"slop": 1,
					      	"in_order": "true"
				    	}
				  	}
				],
				"tie_breaker" : 0.7
		    }
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
