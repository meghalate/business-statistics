'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');


// Get a stock
exports.show = function(req, res) {
	var start=req.query.start;
	var end=req.query.end;
	var sym=new RegExp("^"+req.params.id);

	console.log('Now searching '+sym);
  Stock.find({symbol:sym},'symbol', function (err, stocks) {

    if(err) { 
    	res.status(404).end();
    }
    if(!stocks) { 
    	return res.status(404).send('Not Found'); 
    }
    console.log('Got stocks '+stocks);
    return res.json(stocks);
  });
};