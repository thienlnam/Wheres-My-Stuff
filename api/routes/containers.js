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
    const createSQL = mysql.format('INSERT INTO wmsinventory.Containers (name, size, location, description) VALUES (?, ?, ?, ?)', [
        req.body.name,
        req.body.size,
        req.body.location,
        req.body.description,
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
 * Gets all Containers
 *
 * @param {*} req
 * @param {*} callback
 */
function getContainers(req, callback) {
    let selectSQL = mysql.format('SELECT * FROM wmsinventory.Containers');
    connection.query(selectSQL, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Gets details about a specific container given the containerID
 *
 * @param {*} req
 * @param {*} callback
 */
function getContainer(req, callback) {
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Containers WHERE containerID = ?', [
        req.params.cid,
    ]);
    connection.query(selectSQL, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result[0]);
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
    const containerID = req.params.cid;
    let updateSQL = mysql.format('UPDATE wmsinventory.Containers SET ? = ? WHERE containerID = ?', [
        req.body.column,
        req.body.value,
        containerID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Containers WHERE containerID = ?', [
        containerID,
    ]);
    for (let i = 0; i < 2; i++) {
        updateSQL = updateSQL.replace(/["']/, '');
    }
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
 * Deletes an Container along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteContainer(req, callback) {
    const containerID = req.params.cid;
    let updateSQL = mysql.format('DELETE FROM WMSInventory.Containers WHERE containerID = ?', [
        containerID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM wmsinventory.Containers WHERE containerID = ?', [
        containerID,
    ]);
    // Check if container actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({ status: 404, message: 'Specified container does not exist' });
            } else {
                // Container exists, perform update
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

router.get('/:cid', function (req, res) {
    console.log('Getting all Containers');
    getContainer(req, callback);
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

router.patch('/:cid', function(req, res) {
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

router.delete('/:cid', function(req, res) {
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
