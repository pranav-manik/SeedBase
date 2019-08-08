var elasticsearch=require('elasticsearch');

// var client = new elasticsearch.Client( {  
//   node: 'http://localhost:9200',
//   maxRetries: 5,
//   requestTimeout: 60000,
//   sniffOnStart: true
// });

// var client = new elasticsearch.Client( {  
//   hosts: [
//   'localhost:9200'
//   ]
// });

const index = 'seedss';
const type = 'seeds';
const port = 9200;
const host = process.env.ES_HOST || 'localhost';
const client = new elasticsearch.Client({ host: { host, port } });

/** Check the ES connection status */
module.exports =  {
		checkConnection: async function() {
	  let isConnected = false
	  while (!isConnected) {
	    console.log('Connecting to ES')
	    try {
	      const health = await client.cluster.health({})
	      console.log(health)
	      isConnected = true
	    } catch (err) {
	      console.log('Connection Failed, Retrying...', err)
	    }
	  }
	}
};
// checkConnection();

module.exports = client;