require('dotenv').config({path: '../.env'});

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 3306,
    database: 'wmsinventory',
});

/**
 * Creates a container in the Containers table
 *
 * @param {*} req
 * @param {*} callback
 */
function createContainer(req, callback) {
    const sql = mysql.format('INSERT INTO wmsinventory.Containers (name, quantity, size, location, description) VALUES (?, ?, ?, ?, ?)', [
        req.body.name,
        req.body.quantity,
        req.body.size,
        req.body.location,
        req.body.description,
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
 * Gets all Containers
 *
 * @param {*} req
 * @param {*} callback
 */
function getContainers(req, callback) {
    let sql;
    console.log(process.env.DB_HOST);
    if (Object.keys(req.query).length != 0) {
        sql = mysql.format('SELECT * FROM wmsinventory.Containers WHERE ? = ?', [req.query.filter, req.query.name]);
        for (let i = 0; i < 2; i++) {
            sql = sql.replace(/["']/, '');
        }
    } else {
        sql = mysql.format('SELECT * FROM wmsinventory.Containers');
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Update aspects of a Container based on the name and returns updated Part
 *
 * @param {*} req
 * @param {*} callback
 */
// Bug when updating name and printing updated object
function updateContainer(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Containers SET ? = ? WHERE name = ?', [
        req.body.column,
        req.body.value,
        req.body.name,
    ]);
    const sql1 = mysql.format('SELECT * FROM wmsinventory.Containers WHERE name = ?', [
        req.body.name,
    ]);
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
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
 * Deletes an Container along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteContainer(req, callback) {
    // TODO: Add check if item exists
    // TODO: Delete if exists otherwise give error code and message
    let sql = mysql.format('DELETE FROM WMSInventory.Containers WHERE ? = ?', [
        req.body.criteria,
        req.body.filter,
    ]);
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}


router.post('/', function(req, res) {
    console.log('Creating Container');
    createContainer(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({
                id: data.insertId,
                name: req.body.name,
                quantity: req.body.quantity,
                size: req.body.size,
                location: req.body.location,
                description: req.body.description,
            });
        }
    }
});

router.get('/', function(req, res) {
    console.log('Getting all Containers');
    getContainers(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(data);
        }
    }
});

router.patch('/', function(req, res) {
    console.log('Updating Container');
    updateContainer(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({data});
        }
    }
});

router.delete('/', function(req, res) {
    console.log('Deleting Container');
    deleteContainer(req, callback);
    function callback(err) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(204).json();
        }
    }
});

module.exports = router;
