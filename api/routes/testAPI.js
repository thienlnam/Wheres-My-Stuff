var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'master',
    password: 'Wh3r3$MyStuff',
    database: 'WMSInventory'
})

// ***PARTS Queries*** //
function filterParts(table, criteria, filter, context, callback) {
    var sql = "SELECT * FROM wmsinventory." + table + " WHERE " + criteria + "=" + filter;
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        context.filter = rows;
        return callback();
    });
}

router.get("/filterParts", function (req, res) {
    console.log("Filtering parts");
    var context = {};
    filterParts("Parts", "name", "\"Jackhammer\"", context, callback);
    function callback() {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(context.filter));
    }
})


function getParts(table, context, callback) {
    var sql = "SELECT * FROM wmsinventory." + table;
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err;
        }
        context.parts = rows
        callback();
    });
}

router.get("/getParts", function (req, res) {
    console.log("Getting all parts");
    var context = {};
    getParts("Parts", context, callback);
    function callback() {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(context.parts));
    }
})


function createPart( name, category, quantity, location, callback) {
    var sql = "INSERT INTO wmsinventory.Parts (name, category, partQuantity, partLocation) VALUES (" + name + ", " + category + ", " + quantity + ", " + location + ")";
    connection.query(sql, function (err) {
        if (err) {
            throw err;
        }
        return callback();
    });
}

createPart("\"Jackhammer\"", "\"hammer\"", "2", "\"garage\"", function () {
    router.route('/createTestPart')
        .post(function (req, res, next) {
        console.log("Created Part\n");
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify("Part was successfully added"));
    });
});


function deletePart(criteria, filter, callback) {
    var sql = "DELETE FROM WMSInventory.Parts WHERE " + criteria + " = " + filter;
    connection.query(sql, function (err) {
        if (err) {
            throw err;
        }
        return callback();
    });
}

deletePart("name", "\"ScrewA\"", function () {
    router.route('/deleteTestPart')
        .delete(function (req, res, next) {
        console.log("Deleted Part\n");
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify("Part was successfully deleted"));
    });
});


router.route('/')
    .get(function (req, res, next) {
    res.send('API is working properly');
});
module.exports = router;
