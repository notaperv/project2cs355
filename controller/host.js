var express = require('express');
var router  = express.Router();
var db   = require('../models/db');




router.get('/add', function(req, res){
    db.getUnusedServers(function(err, result) {
        if (err) throw err;
    res.render('editHost.ejs', {action: '/host/add',
                                hostname: 'hostname',
                                ip: 'IP',
                                os: 'OS',
                                kernel: 'kernel',
                                servers: result});
                                });
});

router.post('/edit', function(req, res) {
    db.getHostDetails(req.body.hostname, function(err, host) {
        if (err) throw err;
        db.getUnusedServers(function(err, servers) {
            if (err) throw err;
            servers.unshift({sn: req.body.sn});
            res.render('editHost.ejs', {action: '/host/update',
                                hostname: host[0].hostname,
                                ip: host[0].ip,
                                os: host[0].os,
                                kernel: host[0].kernel,
                                servers: servers});
                                });
        });
    });


router.post('/add', function(req, res) {
    db.InsertHost(req.body, function(err, result) {
        if (err){ 
            throw err;
        }else
        {
            db.isRunningOn(req.body.hostname, req.body.Server, function(err, result) {
                if (err) throw err;
                res.render('return.ejs', {state: 'Added Host!'});
            });
        }
    });
});

router.post('/update', function(req, res) {
    db.updateHost(req.body, function(err, result) {
        if (err) throw err;
        db.getServerFromHost(req.body.oldhostname, function(err, server) {
            if (err) throw err;
            if(server !== req.body.server){
                db.isRunningOn(req.body.hostname, req.body.Server, function(err, result) {
                    if (err) throw err;
                });
            res.render('return.ejs', {state: "Host Edited!"});
            }
        });
    });
});

router.post('/delete', function(req, res) {
    db.deleteHost(req.body.hostname, function(err) {
        if (err) {
            res.render('return.ejs', {state: 'Failed to delete Host!'});
        }else{
            res.render('return.ejs', {state: 'Host Deleted!'});
        }
    });
});

router.post('/editNote', function(req, res){
    res.render('notes.ejs', {action: '/host/addNote', name: req.body.hostname, type: 'host'});
})

router.post('/addNote', function(req, res) {
    db.insertHostNote(req.body.name, req.body.note, function(err) {
        if (err) throw err;
        res.render('return.ejs', {state: 'Note added to host ' + req.body.name});
    });
})
module.exports = router;

