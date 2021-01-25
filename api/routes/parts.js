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
    connection.query(sql, function(err, result) {
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
    if (Object.keys(req.query).length != 0) {
        sql = mysql.format('SELECT * FROM wmsinventory.Parts WHERE ? = ?', [req.query.filter, req.query.name]);
        for (let i = 0; i < 2; i++) {
            sql = sql.replace(/["']/, '');
        }
    } else {
        sql = mysql.format('SELECT * FROM wmsinventory.Parts');
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
 * Gets details about a specific part given the partID
 *
 * @param {*} req
 * @param {*} callback
 */
function getPart(req, callback) {
    const sql = mysql.format('SELECT * FROM wmsinventory.Parts WHERE partID = ?', [
        req.params.pid,
    ]);
    console.log(sql);
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
        }
    });
}

/**
 * Update aspects of a Part based on the name and returns updated Part
 *
 * @param {*} req
 * @param {*} callback
 */
// Bug when updating name and printing updated object
function updatePartByName(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Parts SET ? = ? WHERE name = ?', [
        req.body.column,
        req.body.value,
        req.body.name,
    ]);
    const sql1 = mysql.format('SELECT * FROM wmsinventory.Parts WHERE name = ?', [
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
 * Update aspects of a Part
 *
 * @param {*} req
 * @param {*} callback
 */
function updatePart(req, callback) {
    const partID = req.params.pid;
    const updateSQL = mysql.format('UPDATE wmsinventory.Parts SET name = ?, category = ?, partQuantity = ?, partLocation = ? WHERE partID = ?', [
        req.body.name,
        req.body.category,
        req.body.partQuantity,
        req.body.partLocation,
        partID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Parts WHERE partID = ?', [
        partID,
    ]);

    // Check if part actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({status: 404, message: 'Specified part does not exist'});
            } else {
                // Part exists, perform update
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
 * Deletes an Part along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deletePart(req, callback) {
    const partID = req.params.pid;
    const deleteSQL = mysql.format('DELETE FROM WMSInventory.Parts WHERE partID = ?', [
        partID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Parts WHERE partID = ?', [
        partID,
    ]);

    connection.query(selectSQL, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            // Check if element exits
            if (!result[0]) {
                callback({status: 404, message: 'Specified part does not exist'});
            } else {
                // Part exists, perform update
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
    console.log('Creating Part');
    createPart(req, callback);
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
                category: req.body.category,
                quantity: req.body.quantity,
                locaton: req.body.location,
            });
        }
    }
});

router.get('/', function(req, res) {
    console.log('Getting all Parts' );
    getParts(req, callback);
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

router.get('/:pid', function(req, res) {
    console.log('Getting information for part:', req.params.pid);
    getPart(req, callback);
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
    console.log('Updating Part by name');
    updatePartByName(req, callback);
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

router.patch('/:pid', function(req, res) {
    console.log('Updating Part');
    updatePart(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json(data);
        }
    }
});

router.delete('/:pid', function(req, res) {
    console.log('Deleting Part with ID', req.params.pid);
    deletePart(req, callback);
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
