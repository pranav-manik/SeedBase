var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SeedSchema = new Schema({
	_id : Schema.Types.ObjectId,
	variety : String,
	name : String,
	category : String,
	manufacturer : String,
	maturity : String,
	mat_min : Number,
	mat_max : Number,
	life_cycle : String,
	hybrid_status : String,
	prices : Map,
	organic : Boolean,
	url : String,
	timestamp : Date
});


var Seed = mongoose.model('Seed', SeedSchema);
module.exports = Seed;