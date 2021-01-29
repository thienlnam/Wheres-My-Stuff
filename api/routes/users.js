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
 * Gets details about a specific user given the userID
 *
 * @param {*} req
 * @param {*} callback
 */
function getUser(req, callback) {
    const sql = mysql.format('SELECT * FROM wmsinventory.Users WHERE userID = ?', [
        req.params.uid,
    ]);
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}

/**
 * Update aspects of a User based on the name and returns updated object
 *
 * @param {*} req
 * @param {*} callback
 */
function updateUser(req, callback) {
    const userID = req.params.uid;
    let updateSQL = mysql.format('UPDATE wmsinventory.Users SET ? = ? WHERE userID = ?', [
        req.body.column,
        req.body.value,
        userID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Users WHERE userID = ?', [
        userID,
    ]);
    for (let i = 0; i < 2; i++) {
        updateSQL = updateSQL.replace(/["']/, '');
    }
    // Check if user actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({ status: 404, message: 'Specified user does not exist' });
            } else {
                // User exists, perform update
                connection.query(updateSQL, (err, result) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, req.body);
                    }
                });
            }
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
    const userID = req.params.uid;
    const deleteSQL = mysql.format('DELETE FROM wmsinventory.Users WHERE userID = ?', [
        userID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Users WHERE userID = ?', [
        userID,
    ]);

    connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            // Check if element exits
            if (!result[0]) {
                callback({ status: 404, message: 'Specified user does not exist' });
            } else {
                // User exists, perform update
                connection.query(deleteSQL, (err, result) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            }
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

router.get('/:uid', function (req, res) {
    console.log('Getting User with requested UID');
    getUser(req, callback);
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

router.patch('/:uid', function(req, res) {
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

router.delete('/:uid', function(req, res) {
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
