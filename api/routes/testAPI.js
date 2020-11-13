var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'master',
    password: 'Wh3r3$MyStuff',
    database: 'WMSInventory'
})

/*    (async () => {
        connection.connect();
        const result = await getParts("Parts",)
        router.get('/getParts', function (req, res, next) {
            res.send('The Rows requested: \n', result);
        });
        connection.end();
    })();

function getParts(table) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM wmsinventory.Parts", (err, result) => {
            return err ? reject(err) : resolve(result)
        });
    });
}*/

/*getParts("Parts", function (err, rows) {
    if (err) console.log("ERROR: ", err);
    else {
        router.get('/getParts', function (req, res, next) {
            console.log("Got the body: ", req.body)
            res.send('The Rows requested: \n', rows);
        });
    }
});*/

router.get('/getParts', function (req, res, next) {
    connection.query("SELECT * FROM wmsinventory.Parts", function (err, rows) {
        if (err) throw err;
        else console.log("Parts: /n", rows);
    });
    res.send("Got those parts in the console");
});

router.get('/', function (req, res, next) {
    res.send('API is working properly');
});
module.exports = router;
