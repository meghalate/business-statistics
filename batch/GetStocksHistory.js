'use strict'
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


var YQL=require('yql');
var mongoose = require('mongoose');

var config = require('../server/config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);

var Stock = require('../server/api/stock/stock.model');

Stock.find({},function(err,stockList){
	//iterate the list and get data from yql
	for(var i=0;i<stockList.length;i++)
		GetAndUpdateStocksData(stockList[i]);
	console.log('Press ctrl+c to exit');
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
};

