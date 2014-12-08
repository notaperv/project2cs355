var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'gkeller',
    password: 'ad51cd'
});

var dbToUse = 'gkeller';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

//create the User table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Account('
        + 'UserID INT AUTO_INCREMENT PRIMARY KEY'
        + ',Email VARCHAR(256)'
        + ',Password VARCHAR(50)'
        + ')';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

exports.GetHostList = function(callback) {
    connection.query('select * from host_list;',
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        });
}

exports.getServerDetails = function(hostname, callback) {
    console.log(hostname);
    var query = 'select h.hostname, ip, os, kernel, s.sn from host h join '
                + 'is_running_on run on h.hostname = run.hostname ' 
                + 'join server s on run.sn = s.sn where h.hostname = \''
                + hostname + '\';';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.getUpdates = function(hostname, callback) {
    console.log(hostname);
    var query = 'select h.hostname, name, severity, version, reboot from host h '
                + 'join updates u on h.hostname = u.hostname '
                + 'join update_type ut on u.type = ut.id where h.hostname = \''
                + hostname + '\';';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.getHostNotes = function(hostname, callback) {
    console.log(hostname);
    var query = 'select * from host_notes where id = \''
                + hostname + '\';';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.getServerNotes = function(hostname, callback) {
    console.log(hostname);
    var query = 'select * from is_running_on run join server_notes s on run.sn = s.id where run.hostname = \''
                + hostname + '\';';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.getHostDetails = function(hostname, callback) {
    console.log(hostname);
    var query = 'select * from host where hostname = \''
                + hostname + '\';';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.getHardwareList = function(hostname, callback) {
    console.log(hostname);
    var query = 'select * from server_hardware where sn = (select sn from is_running_on where hostname = \''
                + hostname + '\');';
    console.log(query);
    connection.query(query,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            else{
                callback(false, result);
            }
        });
}

exports.InsertHost = function(hostInfo, callback) {
    console.log(hostInfo);
    var query = 'INSERT INTO host (hostname, ip, os, kernel) VALUES (?, ?, ?, ?);';
    console.log(query);
    connection.query(query, [hostInfo.hostname, hostInfo.ip, hostInfo.os, hostInfo.kernel],
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.isRunningOn = function (hn, sn, callback) {
    connection.query('delete from is_running_on where hostname = ?;', [hn],
        function(err, result){
            if (err) console.log(err);
        });
    connection.query('insert into is_running_on (hostname, sn) values (?, ?);', [hn, sn],
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        });
}

exports.getUnusedServers = function(callback) {
        var query = 'select * from unused_hosts;';
        connection.query(query,
            function (err, result) {
                if(err) {
                    console.log(err);
                    callback(true);
                    return
                }
                callback(false, result);
            });
}

exports.deleteHost = function(host, callback) {
    var query = 'delete from host where hostname = ?;';
    connection.query(query, [host], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        query = 'delete from is_running_on where hostname = ?;';
        connection.query(query, [host], function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false);
        });
    });
}

exports.deleteServer = function(sn, callback) {
    var query = 'delete from host where hostname = (select hostname from is_running_on where sn = ?);';
    connection.query(query, [sn], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        var query = 'delete from server where sn = ?;';
        connection.query(query, [sn], function(err, result){
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false);
        });
    });
    
}

exports.updateHost = function(host, callback) {
    var query = 'update host set hostname = ?, ip = ?, os = ?, kernel = ? where hostname = ?;';
    console.log(query);
    connection.query(query, [host.hostname, host.ip, host.os, host.kernel, host.oldhostname],
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false);
        });
}

exports.getServerFromHost = function(host, callback) {
    var query = 'select sn from is_running_on where hostname = ?;';
    connection.query(query, [host], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result);
    });
}

exports.getCpuTypes = function(callback) {
    var query = 'select id, type as name from cpu;';
    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result);
    });
}

exports.getMemTypes = function(callback) {
    var query = 'select id, type as name from memory;';
    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result);
    });
}

exports.getLocations = function(callback) {
    var query = 'select * from location_list;';
    connection.query(query, function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result);
    });
}

exports.insertServer = function(server, callback) {
    var query = 'insert into server (sn, memType, memoryAmount, cpuType, cpuAmount, location)'
    + ' values (?, ?, ?, ?, ?, ?);';
    connection.query(query, [server.sn, server.memType, server.memoryAmount, server.cpuType, server.cpuAmount, server.location ],
        function(err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false);
        });
}

exports.updateServer = function(server, callback) {
    var query = 'update server set sn = ?, memType = ?, memoryAmount = ?, cpuType = ?, cpuAmount = ?, location = ? where sn = ?;';
    connection.query(query, [server.sn, server.memType, server.memoryAmount, server.cpuType, server.cpuAmount, server.location, server.sn],
        function(err, result) {
            if (err){
                console.log(err);
                callback(true);
                return
            }
            callback(false);
        });
}

exports.insertHarddrives = function(hddsize,hddtype, sn, callback) {
        var query = 'delete from harddrives where server = ?;';
        console.log(query);
        connection.query(query, [sn], function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return
            }
            for (var i = 0; hddsize.length > i; i++) {
                var query = 'insert into harddrives (server, size, model) values (?, ?, ?);';
                connection.query(query, [sn, hddsize[i], hddtype[i]], function(err, result) {
                    if (err) {
                        console.log(err);
                        callback(true);
                        return
                    }
                    
                });
            }
            callback(false);
        });
        
}

exports.getHarddrives = function(sn, callback) {
    var query = 'select * from harddrives where server = ?;';
    connection.query(query, [sn], function(err, result){
      if (err) {
        console.log(err);
        callback(true);
        return
    }
    callback(false, result);  
});
}

exports.getServerEdit = function(sn, callback) {
    var query = 'select * from server where sn = ?;';
        connection.query(query, [sn], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result);
    });
}

exports.insertHWNote = function(sn, note, callback) {
    var query = 'insert into server_notes (id, note) values (?, ?);';
    connection.query(query, [sn, note], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result); 
    });
}

exports.insertHostNote = function(hostname, note, callback) {
    var query = 'insert into host_notes (id, note) values (?, ?);';
    connection.query(query, [hostname, note], function(err, result) {
        if (err) {
            console.log(err);
            callback(true);
            return
        }
        callback(false, result); 
    });
}