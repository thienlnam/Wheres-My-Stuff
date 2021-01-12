require('dotenv').config({ path: '../.env' });

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

/**
 * Creates a part in the Parts table
 *
 * @param {*} req
 * @param {*} callback
 */
function createPart(req, callback) {
    const sql = mysql.format('INSERT INTO wmsinventory.Parts (name, category, partQuantity, partLocation) VALUES (?, ?, ?, ?)', [
        req.body.name,
        req.body.category,
        req.body.quantity,
        req.body.location,
    ]);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Gets all items from a provided table
 *
 * @param {*} req
 * @param {*} callback
 */
function getParts(req, callback) {
    let sql;
    if (req.params != "{}") {
        console.log(params);
        sql = mysql.format('SELECT * FROM wmsinventory.Parts WHERE ? = ?', [req.params.filter, req.params.name]);
    } else {
        sql = mysql.format('SELECT * FROM wmsinventory.Parts');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Update aspects of a Part based on the name and returns updated Part
 *
 * @param {*} req
 * @param {*} callback
 */
//Bug when updating name and printing updated object
function updatePart(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Parts SET ? = ? WHERE name = ?', [
        req.body.column,
        req.body.value,
        req.body.name,
    ]);
    let sql1 = mysql.format('SELECT * FROM wmsinventory.Parts WHERE name = ?', [
        req.body.name,
    ]);
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            connection.query(sql1, function (err, result) {
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
 * Deletes an Part along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deletePart(req, callback) {
    // TODO: Add check if item exists
    // TODO: Delete if exists otherwise give error code and message
    let sql = mysql.format('DELETE FROM WMSInventory.Parts WHERE ? = ?', [
        req.body.criteria,
        req.body.filter,
    ]);
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


router.post('/', function (req, res) {
    console.log('Creating Part');
    createPart(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({
                id: data.insertId,
                name: req.body.name,
                category: req.body.category,
                quantity: req.body.quantity,
                locaton: req.body.location,
            });
        }
    }
});

router.get('/', function (req, res) {
    console.log('Getting all Parts' );
    getParts(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        }
    }
});

router.patch('/', function (req, res) {
    console.log('Updating Part');
    updatePart(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ data });
        }
    }
});

router.delete('/', function (req, res) {
    console.log('Deleting Part');
    deletePart(req, callback);
    function callback(err) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(204).json();
        }
    }
});

module.exports = router;