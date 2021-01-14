require('dotenv').config({path: '../.env'});

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 3306,
    database: 'WMSInventory',
});
// --LEAVING THESE FOR NOW-- //
/**
 * Add a Part to a Container
 *
 * @param {*} req
 * @param {*} callback
 */
function addPart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers SET partID = (SELECT partID FROM wmsinventory.Parts WHERE name = ?), quantity = (SELECT partQuantity FROM wmsinventory.Parts WHERE name = ?) WHERE name = ? AND partID IS NULL', [
        req.body.partName,
        req.body.partName,
        req.body.name,
    ]);
    const sql1 = mysql.format('UPDATE wmsinventory.Parts SET partLocation = (SELECT DISTINCT name FROM wmsinventory.Containers WHERE name = ?) WHERE name = ?', [
        req.body.name,
        req.body.partName,
    ]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            connection.query(sql1, function(err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, result);
                }
            });
        }
    });
}

/**
 * Remove a Part to a Container
 *
 * @param {*} req
 * @param {*} callback
 */
// Should Part become 'Loose'? Or go to area container is in?
function removePart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers c INNER JOIN wmsinventory.Parts p ON (c.partID = p.partID) SET c.partID = null, c.quantity = 0, p.partLocation = c.location WHERE c.name = ? AND c.partID = p.partID', [
        req.body.name,
        req.body.name,
        req.body.partName,
    ]);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Check for duplicate Parts before modifying the quantity
 *
 * @param {*} req
 * @param {*} callback
 */
function checkDuplicates(req, callback) {
    const sql = mysql.format('SELECT name FROM wmsinventory.Parts WHERE name = ?', [
        req,
    ]);
    connection.query(sql, function(err, result) {
        if (err) {
            return err;
        } else {
            // Call function to inform user?
            return result;
        }
    });
}

router.patch('/addPart', function(req, res) {
    console.log('Adding ' + req.body.partName + ' to ' + req.body.name);
    addPart(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send('Added ' + req.body.partName + ' to ' + req.body.name);
        }
    }
});

router.patch('/removePart', function(req, res) {
    console.log('Removing ' + req.body.partName + ' from ' + req.body.name);
    removePart(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send('Removed ' + req.body.partName + ' from ' + req.body.name);
        }
    }
});

module.exports = router;
