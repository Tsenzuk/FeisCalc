var express = require('express');
var router = express.Router();

var user = require("../models/user");
var feis = require("../models/feis");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FeisCalc', userModel:user, feisModel:feis });
});

module.exports = router;
