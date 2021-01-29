require('dotenv').config({ path: '../.env' });

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
 * Creates a ContainedBy in the ContainedBy table
 *
 * @param {*} req
 * @param {*} callback
 */
function createContains(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    let sql = mysql.format('INSERT INTO wmsinventory.ContainedBy (partID, containerID, identifier, quantity) VALUES (?, ?, ?, ?)', [
        partID,
        containerID,
        req.body.identifier,
        req.body.quantity,
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
 * Update aspects of ContainedBy based on the IDs and returns updated ContainedBy
 *
 * @param {*} req
 * @param {*} callback
 */
// Bug when updating name and printing updated object
function updateContainsByIDs(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    let sql = mysql.format('UPDATE wmsinventory.ContainedBy SET ? = ? WHERE partID = ? AND containerID = ?', [
        req.body.column,
        req.body.value,
        partID,
        containerID,
    ]);
    const sql1 = mysql.format('SELECT * FROM wmsinventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
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
 * Update aspects of ContainedBy
 *
 * @param {*} req
 * @param {*} callback
 */
function updateContains(req, callback) {
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

    // Check if containedBy actually exists with a SELECT before updating
    connection.query(selectSQL, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            if (!result[0]) {
                callback({ status: 404, message: 'Specified relationship does not exist' });
            } else {
                // ContainedBy exists, perform update
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
 * Deletes a ContainedBy along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteContains(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    const deleteSQL = mysql.format('DELETE FROM wmsinventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM wmsinventory.ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    connection.query(selectSQL, function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            // Check if element exits
            if (!result[0]) {
                callback({ status: 404, message: 'Specified containedBy does not exist' });
            } else {
                // ContainedBy exists, perform update
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


router.post('/Containers/:cid/Parts/:pid', function (req, res) {
    console.log('Adding part to container');
    createContains(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json();
        }
    }
});

// Need to find a way to separate two updates
router.patch('/Containers/:cid/Parts/:pid', function (req, res) {
    console.log('Updating ContainedBy');
    updateContainsByIDs(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json();
        }
    }
});

router.patch('/Containers/:cid/Parts/:pid', function (req, res) {
    console.log('Updating ContainedBy');
    updateContains(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json();
        }
    }
});

router.delete('/Containers/:cid/Parts/:pid', function (req, res) {
    console.log('Deleting ContainedBy');
    deleteContains(req, callback);
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
