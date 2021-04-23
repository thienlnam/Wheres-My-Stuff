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
    const sql = mysql.format('INSERT INTO Parts (name) VALUES (?)', [
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
    let sql = '';
    const nameFilter = req.query.name;
    if (nameFilter) {
        sql = mysql.format('SELECT Parts.name AS partName, Parts.partID, Containers.name as containerName, Containers.containerID, size, location, quantity FROM Parts, ContainedBy, Containers WHERE Parts.name LIKE CONCAT(\'%\', ?, \'%\') AND ContainedBy.partID = Parts.partID AND ContainedBy.containerID = Containers.containerID', [
            nameFilter,
        ]);
    } else {
        sql = mysql.format('SELECT * FROM (SELECT P.partID, P.name, group_concat(DISTINCT C.name) AS categories FROM Parts P, CategorizedBy CB, Categories C WHERE P.partID = CB.partID AND C.categoryID = CB.categoryID GROUP BY P.name, P.partID ORDER BY P.partID) AS A RIGHT JOIN (SELECT P1.partID, P1.name FROM Parts P1) AS B ON A.partID = B.partID GROUP BY B.partID;');
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
 * Creates a ContainedBy in the ContainedBy table
 *
 * @param {*} req
 * @param {*} callback
 */
function createContainedBys(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    const sql = mysql.format('INSERT INTO ContainedBy (partID, containerID, identifier, quantity) VALUES (?, ?, ?, ?)', [
        partID,
        containerID,
        req.body.identifier || '',
        req.body.quantity,
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
 * Get all parts and container pairs
 *
 * @param {*} req
 * @param {*} callback
 */
function getContainedBy(req, callback) {
    let sql = '';
    const nameFilter = req.query.name;
    const containerFilter = req.query.containerName;
    const partID = req.query.partID;
    const containerID = req.query.containerID;

    if (nameFilter) {
        sql = mysql.format('SELECT p.partID, p.name as partName, cb.containerID, c.name as containerName, cb.quantity, cb.identifier FROM Parts as p, Containers as c, ContainedBy as cb WHERE p.name LIKE CONCAT(\'%\', ?, \'%\') AND p.partID = cb.partID AND c.containerID = cb.containerID;', [
            nameFilter,
        ]);
    } else if (containerFilter) {
        sql = mysql.format('SELECT p.partID, p.name as partName, cb.containerID, c.name as containerName, cb.quantity FROM Parts as p, Containers as c, ContainedBy as cb WHERE c.name LIKE CONCAT(\'%\', ?, \'%\') AND p.partID = cb.partID AND c.containerID = cb.containerID', [
            containerFilter,
        ]);
    } else if (partID && containerID) {
        sql = mysql.format('SELECT p.partID, p.name as partName, cb.containerID, c.name as containerName, cb.quantity FROM Parts as p, Containers as c, ContainedBy as cb WHERE cb.partID = ? AND cb.containerID = ? AND p.partID = cb.partID AND c.containerID = cb.containerID', [
            partID,
            containerID,
        ]);
        console.log(sql);
    } else {
        sql = mysql.format('SELECT p.partID, p.name as partName, cb.containerID, c.name as containerName, cb.quantity, cb.identifier FROM Parts as p, Containers as c, ContainedBy as cb WHERE p.partID = cb.partID AND c.containerID = cb.containerID;');
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
 * Update aspects of a Part
 *
 * @param {*} req
 * @param {*} callback
 */
function updateContainedBy(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;

    // Quick hack to only update quantity
    let updateSQL;
    if (req.body.quantity && !req.body.identifier) {
        updateSQL = mysql.format('UPDATE ContainedBy SET quantity = ? WHERE partID = ? AND containerID = ?', [
            req.body.quantity,
            partID,
            containerID,
        ]);
    } else {
        updateSQL = mysql.format('UPDATE ContainedBy SET identifier = ?, quantity = ? WHERE partID = ? AND containerID = ?', [
            req.body.identifier,
            req.body.quantity,
            partID,
            containerID,
        ]);
    }
    const selectSQL = mysql.format('SELECT * FROM ContainedBy WHERE partID = ? AND containerID = ?', [
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
function deleteContainedBy(req, callback) {
    const partID = req.params.pid;
    const containerID = req.params.cid;
    const deleteSQL = mysql.format('DELETE FROM ContainedBy WHERE partID = ? AND containerID = ?', [
        partID,
        containerID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM ContainedBy WHERE partID = ? AND containerID = ?', [
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
    const sql = mysql.format('SELECT * FROM Parts WHERE partID = ?', [
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
    const updateSQL = mysql.format('UPDATE Parts SET name = ? WHERE partID = ?', [
        req.body.name,
        partID,
    ]);
    const selectSQL = mysql.format('SELECT * FROM Parts WHERE partID = ?', [
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
    const deleteSQL = mysql.format('DELETE FROM Parts WHERE partID = ?', [
        partID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM Parts WHERE partID = ?', [
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
    getContainedBy(req, callback);
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

router.post('/:pid/Containers/:cid', function(req, res) {
    console.log('Creating Part / Container Pair');
    createContainedBys(req, callback);
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

router.patch('/:pid/Containers/:cid', function(req, res) {
    console.log('Updating Part / Container Pair');
    updateContainedBy(req, callback);
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
    deleteContainedBy(req, callback);
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
