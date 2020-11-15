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
    router.get('/filterParts', function (req, res, next) {
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
    router.get('/getParts', function (req, res, next) {
        console.log(partsVal);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(partsVal));
    });

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
