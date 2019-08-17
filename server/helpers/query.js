
module.exports = {

	//Generates Queries for ES
	generateQuery: function(search) {
		var search_array = search.split(" ");
		//if searching 1 word
		if (search_array.length == 1) {
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
		    return query;
		}


		//if search query is more than 1 word
		else if (search_array.length > 1) {
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
			  return query;
		}
		return null;
	}
}