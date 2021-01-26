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
 * Creates a user in the users table
 *
 * @param {*} req
 * @param {*} callback
 */
function createUser(req, callback) {
    // TODO: Either encrypt password OR use a different oauth provider
    const sql = mysql.format('INSERT INTO wmsinventory.Users (username, password) VALUES (?, ?)', [
        req.body.username,
        req.body.password,
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
 * Gets all Users
 *
 * @param {*} req
 * @param {*} callback
 */
function getUsers(req, callback) {
    let sql;
    if (Object.keys(req.query).length != 0) {
        sql = mysql.format('SELECT * FROM wmsinventory.Users WHERE ? = ?', [req.query.filter, req.query.name]);
        for (let i = 0; i < 2; i++) {
            sql = sql.replace(/["']/, '');
        }
    } else {
        sql = mysql.format('SELECT * FROM wmsinventory.Users');
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
 * Update aspects of a User based on the name and returns updated object
 *
 * @param {*} req
 * @param {*} callback
 */
// Bug when updating name and printing updated object
function updateUser(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Users SET ? = ? WHERE username = ?', [
        req.body.column,
        req.body.value,
        req.body.name,
    ]);
    // Printing may be bugged
    const sql1 = mysql.format('SELECT * FROM wmsinventory.Users WHERE username = ?', [
        req.body.table,
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
 * Deletes a User along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteUser(req, callback) {
    // TODO: Add check if item exists
    // TODO: Delete if exists otherwise give error code and message
    let sql = mysql.format('DELETE FROM WMSInventory.Users WHERE ? = ?', [
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
    console.log('Creating User');
    createUser(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({
                id: data.insertId,
                username: req.body.username,
            });
        }
    }
});

router.get('/', function(req, res) {
    console.log('Getting Users');
    getUsers(req, callback);
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
    console.log('Updating User');
    updateUser(req, callback);
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
    console.log('Deleting User');
    deleteUser(req, callback);
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
