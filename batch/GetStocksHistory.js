'use strict'
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var YQL=require('yql');
var mongoose = require('mongoose');

var config = require('../server/config/environment');
var dbURI=config.mongo.uri;
// Connect to database
console.log("About to connect to "+config.mongo.uri);

mongoose.connect(config.mongo.uri);

mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 


// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

var Stock = require('../server/api/stock/stock.model');
var Quote= require('../server/api/quote/quote.model');

Stock.find({symbol: /^[Z]/},function(err,stockList){
	if(err){
		console.error('error while makeing query'+err);
		process.exit(-1);
	}
	//iterate the list and get data from yql
	console.log('found '+stockList.length +' records ');
	//addQuotes(stockList.quotes);
	for(var i=0;i<stockList.length;i++){
		console.log(i);
		addQuotes(stockList[i].quotes);
		//GetAndUpdateStocksData(stockList[i]);
	}
	
});


function GetAndUpdateStocksData(stock){
	console.log('fetching quotes for stock symbol'+stock.symbol);
	if(!stock.symbol){
		return;
	}
	var query = new YQL('select * from yahoo.finance.historicaldata where symbol ="'+stock.symbol+'" and startDate = "2014-07-06" and endDate = "2015-07-05"');

	console.log('calling yql now for '+stock.symbol)
	query.exec(function (error, response) {
	    // Do something with results (response.query.results)
	    if(error){
	    	console.log('got error for '+stock.symbol);
	    	return;
	    }
	    
	    if(response.query.results && response.query.results.quote){
	    	console.log("got "+response.query.results.quote.length+" responses for "+stock.symbol);
	    	UpdateStockQuotes(stock,response.query.results.quote);
	    }
	   
	});

};

function UpdateStockQuotes(stock,quotes){
	console.log("Now processing responses for "+stock.symbol);
	for(var i=0;i<quotes.length;i++){
	    if(quotes[i])
	    	Stock.findByIdAndUpdate(stock._id,{$push:{quotes:quotes[i]} },function(err,model){
	    		// to do
	    	});
	}
	console.log('Press ctrl+c to exit');
};

function addQuotes(quotes){
	for(var i=0;i<quotes.length;i++){
		//console.log('Now creating '+quotes[i]);
		if(quotes[i]){
			Quote.create(quotes[i],function(err,data){
				if(err)
				console.log('Erro while creating record '+err);
				else
					console.log('done'+i);
			});
		}

	}
	console.log('Press ctrl+c to exit');
}