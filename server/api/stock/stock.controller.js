'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');


// Get a stock
exports.show = function(req, res) {
	var start=req.query.start;
	var end=req.query.end;

  Stock.find({symbol:req.params.id, 'quotes.Date' :{$gte:new Date('2015-08-08T04:22:00.159Z')}}, function (err, stock) {
    if(err) { return;}
    if(!stock) { return res.status(404).send('Not Found'); }
    return res.json(stock);
  });
};