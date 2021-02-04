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
 * Creates a new category
 *
 * @param {*} req
 * @param {*} callback
 */
function createCategory(req, callback) {
    const createSQL = mysql.format('INSERT INTO wmsinventory.Categories (name) VALUES (?)', [
        req.body.name,
    ]);
    connection.query(createSQL, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Gets all Categories
 *
 * @param {*} req
 * @param {*} callback
 */
function getCategories(req, callback) {
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Categories');
    connection.query(selectSQL, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Gets details about a specific category given the categoryID
 *
 * @param {*} req
 * @param {*} callback
 */
function getCategory(req, callback) {
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Categories WHERE categoryID = ?', [
        req.params.cid,
    ]);
    connection.query(selectSQL, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}

/**
 * Update aspects of a Category based on the name and returns updated Part
 *
 * @param {*} req
 * @param {*} callback
 */
// Bug when updating name and printing updated object
function updateCategory(req, callback) {
    const categoryID = req.params.cid;
    const updateSQL = mysql.format('UPDATE wmsinventory.Categories SET name = ? WHERE categoryID = ?', [
        req.body.name,
        categoryID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Categories WHERE categoryID = ?', [
        categoryID,
    ]);
    connection.query(updateSQL, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            connection.query(selectSQL, function(err, result) {
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
 * Deletes a Category along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteCategory(req, callback) {
    const categoryID = req.params.cid;
    const updateSQL = mysql.format('DELETE FROM WMSInventory.Categories WHERE categoryID = ?', [
        categoryID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Categories WHERE categoryID = ?', [
        categoryID,
    ]);
    // Check if category actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({status: 404, message: 'Specified category does not exist'});
            } else {
                // Category exists, perform update
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


router.post('/', function(req, res) {
    console.log('Creating Category');
    createCategory(req, callback);
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
            });
        }
    }
});

router.get('/', function(req, res) {
    console.log('Getting all Categories');
    getCategories(req, callback);
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

router.get('/:cid', function(req, res) {
    console.log('Getting specified Category');
    getCategory(req, callback);
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

router.patch('/:cid', function(req, res) {
    console.log('Updating Category');
    updateCategory(req, callback);
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

router.delete('/:cid', function(req, res) {
    console.log('Deleting Category');
    deleteCategory(req, callback);
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
