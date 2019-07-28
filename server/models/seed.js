var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;
var client = require('../connection');

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

// Hook to Mongoostastic
SeedSchema.plugin(mongoosastic,{  
  hosts: [
  'localhost:9200'
  ]
});

SeedSchema.methods.getCategory =  function(category) {
	return this.model('seeds').find({'category': this.category})
};

var Seed = mongoose.model('seeds', SeedSchema)


Seed.createMapping(function(err, mapping){  
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else{
    console.log('mapping created!');
    console.log(mapping);
  }
});



stream = Seed.synchronize();
count = 0;

stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
  client.checkConnection;
});
stream.on('error', function(err){
  console.log(err);
});

module.exports = Seed;