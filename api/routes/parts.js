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
 * Creates a part in the Parts table
 *
 * @param {*} req
 * @param {*} callback
 */
function createPart(req, callback) {
    const sql = mysql.format('INSERT INTO wmsinventory.Parts (name) VALUES (?)', [
        req.body.name,
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
 * Gets all parts from the table
 *
 * @param {*} req
 * @param {*} callback
 */
function getParts(req, callback) {
    const sql = mysql.format('SELECT * FROM Parts');
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Get all parts and container pairs
 *
 * @param {*} req
 * @param {*} callback
 */
function getPartContainers(req, callback) {
    let sql;
    sql = mysql.format('SELECT p.partID, p.name as partName, cb.containerID, c.name as containerName, cb.quantity, cb.identifier  FROM Parts as p, Containers as c, ContainedBy as cb WHERE p.partID = cb.partID AND c.containerID = cb.containerID;');
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Update aspects of a Part
 *
 * @param {*} req
 * @param {*} callback
 */
function updatePartContainer(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    const updateSQL = mysql.format('UPDATE wmsinventory.ContainedBy SET identifier = ?, quantity = ? WHERE partID = ? AND containerID = ?', [
        req.body.identifier,
        req.body.quantity,
        partID,
        containerID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    // Check if pair actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({status: 404, message: 'Specified part/container does not exist'});
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
function deletePartContainer(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    const deleteSQL = mysql.format('DELETE FROM WMSInventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM wmsinventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    connection.query(selectSQL, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            // Check if element exits
            if (!result[0]) {
                callback({status: 404, message: 'Specified relation does not exist'});
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
 * Update aspects of a Part
 *
 * @param {*} req
 * @param {*} callback
 */
function updatePart(req, callback) {
    const partID = req.params.pid;
    const updateSQL = mysql.format('UPDATE wmsinventory.Parts SET name = ? WHERE partID = ?', [
        req.body.name,
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

router.get('/Containers', function(req, res) {
    console.log('Getting all Part Containers' );
    getPartContainers(req, callback);
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

router.patch('/:pid/Containers/:cid', function(req, res) {
    console.log('Updating Part / Container Pair');
    updatePartContainer(req, callback);
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

router.delete('/:pid/Containers/:cid', function(req, res) {
    console.log('Deleting Part / Container Pair');
    deletePartContainer(req, callback);
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
