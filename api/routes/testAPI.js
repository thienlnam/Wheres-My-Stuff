var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'master',
    password: 'Wh3r3$MyStuff',
    database: 'WMSInventory'
})

var filterVal;

function filterParts(table, criteria, filter, callback) {
    var sql = "SELECT * FROM wmsinventory." + table + " WHERE " + criteria + "=" + filter;
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        filterVal = rows;
        return callback(rows);
    });
}

filterParts("Parts", "name", "\"ScrewA\"", function (rows) {
    filterVal = rows;
    router.get('/filterTestParts', function (req, res, next) {
        console.log(filterVal);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(filterVal));
    });
});


var partsVal;

function getParts(table, callback) {
    var sql = "SELECT * FROM wmsinventory." + table;
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        partsVal = rows;
        return callback(rows);
    });
}

getParts("Parts", function (rows) {
    partsVal = rows;
    router.get('/getTestParts', function (req, res, next) {
        console.log(partsVal);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(partsVal));
    });

});

router.get('/', function (req, res, next) {
    res.send('API is working properly');
});
module.exports = router;
