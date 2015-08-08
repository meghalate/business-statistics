'use strict';

var express = require('express');
var controller = require('./quote.controller');

var router = express.Router();

router.get('/:sym', controller.show);

module.exports = router;