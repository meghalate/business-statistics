'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
  symbol: String,
  name: String,
  lastsale: Number,
  marketCap:String,
  IPOYear:String,
  sector:String,
  industry:String,
  summaryQuote:String,
  quotes: [{
  	Symbol: String,
     Date: Date,
     Open: Number,
     High: Number,
     Low: Number,
     Close: Number,
     Volume: Number,
     Adj_Close: Number
  }]
});

module.exports = mongoose.model('Stock', StockSchema);