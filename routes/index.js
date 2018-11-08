var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {


     router.use(express.static('public'));
    //res.sendFile(path.join(__dirname + '/../public/home/index.html'));
    res.render('index', { title: 'ECE 413 awesome server' });
});

module.exports = router;
 
