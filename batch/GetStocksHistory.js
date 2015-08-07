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

});


function GetAndUpdateStocksData(stock){
	console.log('stock symbol'+stock.symbol);

	var query = new YQL('select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate = "2015-07-06" and endDate = "2015-08-06"');

	console.log('calling yql now for 'stock.symbol)
	query.exec(function (error, response) {
		console.log(stock);
	    // Do something with results (response.query.results)
	    if(error){
	    	console.log('got error for '+stock.symbol);
	    	return;
	    }
	    if(response.query.results.quote){
	    	UpdateStockQuotes(stock,response.query.results.quote);
	    }
	   
	});

};

function UpdateStockQuotes(stock,quotes){
	for(var i=0;i<quotes.length;i++){
	    if(quotes[i])
	    	Stock.findByIdAndUpdate(stock._id,{$push:{quotes:quotes[i]} },function(err,model){
	    		// to do
	    	});
	}
};

var testQuotes= [{
     "Symbol": "YHOO",
     "Date": "2015-08-05",
     "Open": "37.32",
     "High": "37.709999",
     "Low": "37.23",
     "Close": "37.25",
     "Volume": "6837900",
     "Adj_Close": "37.25"
    },
    {
     "Symbol": "YHOO",
     "Date": "2015-08-04",
     "Open": "36.610001",
     "High": "37.209999",
     "Low": "36.599998",
     "Close": "37.119999",
     "Volume": "8999000",
     "Adj_Close": "37.119999"
    }];