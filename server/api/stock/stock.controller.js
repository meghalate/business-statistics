'use strict';

var _ = require('lodash');
var Stock = require('./stock.model');


// Get a stock
exports.show = function(req, res) {
  Stock.findOne({symbol:req.params.id}, function (err, stock) {
    if(err) { return;}
    if(!stock) { return res.status(404).send('Not Found'); }
    return res.json(stock);
  });
};