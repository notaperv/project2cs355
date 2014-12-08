var express = require('express');
var router  = express.Router();
var db   = require('../models/db');

router.get('/add', function(req, res) {
	db.getCpuTypes(function(err, cpu){
		if (err) throw err;
		db.getMemTypes(function(err, mem){
			if (err) throw err;
			db.getLocations(function(err, locations){
				if (err) throw err;
				res.render('editServer', {memType: mem,
										  cpuType: cpu,
										  location: locations,
										  action: '/server/add',
										  server: [{sn: 'Serial Number', cpuType: "0", memType: "0", cpuAmount: "0", memoryAmount: "0", location: "0"}],
										  hdlist: [{model: '0', size: '0'}]});
			});
		});
	});
});

router.post('/add', function(req, res) {
	db.insertServer(req.body, function(err) {
		if (err) throw err;
		db.insertHarddrives(req.body.harddrivesize, req.body.harddrivetype, req.body.sn, function(err){
			if (err) throw err;
			res.render('return.ejs', {state: 'Server Added!'})
		});
	});
});

router.post('/edit', function(req, res) {
	db.getCpuTypes(function(err, cpu){
		if (err) throw err;
		db.getMemTypes(function(err, mem){
			if (err) throw err;
			db.getLocations(function(err, locations){
				if (err) throw err;
				db.getHarddrives(req.body.sn, function(err, hdd) {
					if (err) throw err;
					db.getServerEdit(req.body.sn, function(err, server){
						res.render('editServer', {memType: mem,
							cpuType: cpu,
							location: locations,
							server: server,
							action: '/server/update',
							hdlist: hdd});
					});
				});
			});
		});
	});
});

router.post('/update', function(req, res) {
	db.updateServer(req.body, function(err, result) {
		if (err) throw err;
		db.insertHarddrives(req.body.harddrivesize, req.body.harddrivetype, req.body.sn, function(err){
			if (err) throw err;
			res.render('return.ejs', {state: 'Server Edited!'})
		});
	});
});

router.post('/delete', function(req, res) {
		db.deleteServer(req.body.server, function(err) {
			if (err) throw err;
			res.render('return.ejs', {state: 'Server Deleted!'});
		});
});

router.post('/editNote', function(req, res){
	res.render('notes.ejs', {action: '/server/addNote', name: req.body.sn, type: 'Server'});
})

router.post('/addNote', function(req, res) {
	db.insertHWNote(req.body.name, req.body.note, function(err) {
		if (err) throw err;
		res.render('return.ejs', {state: 'Note added to Server ' + req.body.name});
	});
})

module.exports = router;