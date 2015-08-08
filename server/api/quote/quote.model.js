'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuoteSchema = new Schema({
  	Symbol: String,
     'Date': Date,
     Open: Number,
     High: Number,
     Low: Number,
     Close: Number,
     Volume: Number,
     Adj_Close: Number
});

module.exports = mongoose.model('Quote', QuoteSchema);