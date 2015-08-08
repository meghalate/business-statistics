'use strict';

var _ = require('lodash');
var Quote = require('./quote.model');


// Get a stock
exports.show = function(req, res) {
	var start=req.query.start;
	var end=req.query.end;
console.log("Querying quotes for "+req.params.sym +' for dates '+start+end);
  Quote.find({Symbol:req.params.sym, 'Date' :{$gte:new Date(start)}}, function (err, quote) {
    if(err) { 
    	console.log('Error while querying '+err);
    	res.status(400).end();
    }
    if(!quote) { return res.status(404).send('Not Found'); }
    return res.json(quote);
  });
};