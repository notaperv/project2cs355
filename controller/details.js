var express = require('express');
var router = express.Router();
var db   = require('../models/db');

//server details page.
router.get('/', function (req, res) {
	db.getServerDetails(req.query.host, function (err, serverDetails) {
		if (err) throw err;
		db.getUpdates(req.query.host, function (err, updates) { 
			if (err) throw err;
			db.getHostNotes(req.query.host, function (err, hostNotes) {
				if (err) throw err;
				db.getServerNotes( req.query.host, function (err, serverNotes){
					if (err) throw err;
					db.getHostDetails( req.query.host, function (err, hostDetails) {
						if (err) throw err;
						db.getHardwareList( req.query.host, function (err, hwList) {
							if (err) throw err;
							res.render('displayDetails.ejs', {rs: serverDetails, hw: hwList, hwnotes: serverNotes, updates: updates, hostnotes: hostNotes  });
						})
						
					});
				});
			});
		});
	});
});

module.exports = router;