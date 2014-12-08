var express = require('express');
var router = express.Router();
var db   = require('../models/db');

/* GET home page. */
router.get('/', function(req, res) {
    db.GetHostList(function (err, result) {
    	if (err) throw err;
    	res.render('index.ejs', {rs: result})
    })

});

router.get('/about', function(req, res) {
	res.render('about.ejs');
});



module.exports = router;

