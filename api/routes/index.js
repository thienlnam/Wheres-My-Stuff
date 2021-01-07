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
 * Gets all items from a provided table
 *
 * @param {*} req
 * @param {*} callback
 */
function getItems(req, callback) {
    let sql = mysql.format('SELECT * FROM wmsinventory.?', [
        req.body.table,
    ]);
    sql = sql.replace(/['"]/g, '');
    connection.query(sql, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

/**
 * Filters all items from a given table with the provided criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function filterItems(req, callback) {
    let sql = mysql.format('SELECT * FROM wmsinventory.? WHERE ? = ?', [
        req.body.table,
        req.body.criteria,
        req.body.filter,
    ]);
    for (let i = 0; i < 4; i++) {
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

/**
 * Deletes an item from a given table along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteItem(req, callback) {
    // TODO: Add check if item exists
    // TODO: Delete if exists otherwise give error code and message
    let sql = mysql.format('DELETE FROM WMSInventory.? WHERE ? = ?', [
        req.body.table,
        req.body.criteria,
        req.body.filter,
    ]);
    for (let i = 0; i < 4; i++) {
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

/**
 * Increments the Part quantity by the number specified in the request
 *
 * @param {*} req
 * @param {*} callback
 */
function incrementPart(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Parts SET partQuantity = partQuantity + ? WHERE name = ?', [
        req.body.partQuantity,
        req.body.name,
    ])
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
    connection.query(sql, function(err) {
        if (err) {
            throw err;
        }
        callback();
    })
}

/**
 * Decrements the Part quantity by the number specified in the request
 *
 * @param {*} req
 * @param {*} callback
 */
function decrementPart(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Parts SET partQuantity = partQuantity - ? WHERE name = ? AND partQuantity > 0', [
        req.body.partQuantity,
        req.body.name,
    ])
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '');
    }
    connection.query(sql, function(err) {
        if (err) {
            throw err;
        }
        callback();
    })
}

/**
 * Increments the Part quantity in a Container by the number specified in the request
 *
 * @param {*} req
 * @param {*} callback
 */
function incrementContainerPart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers SET quantity = quantity + ? WHERE name = ?', [
        req.body.quantity,
        req.body.name,
    ])
    connection.query(sql, function(err) {
        if (err) {
            throw err;
        }
        callback();
    })
}

/**
 * Decrements the Part quantity in a Container by the number specified in the request
 *
 * @param {*} req
 * @param {*} callback
 */
function decrementContainerPart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers SET quantity = quantity - ? WHERE name = ? AND quantity > 0', [
        req.body.quantity,
        req.body.name,
    ])
    connection.query(sql, function(err) {
        if (err) {
            throw err;
        }
        callback();
    })
}

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
 * Creates a new category
 *
 * @param {*} req
 * @param {*} callback
 */
function createCategory(req, callback) {
    const sql = mysql.format('INSERT INTO wmsinventory.Categories (name) VALUES (?)', [
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

router.get('/getItems', function(req, res) {
    console.log('Getting all ' + req.body.table);
    getItems(req, callback);
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

router.get('/filterItems', function(req, res) {
    console.log('Filtering ' + req.body.table);
    const context = {};
    filterItems(req, context, callback);
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

router.delete('/deleteItem', function(req, res) {
    console.log('Deleting ' + req.body.table);
    deleteItem(req, callback);
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

router.post('/incrementPart', function(req, res) {
    console.log('Incrementing ' + req.body.name);
    incrementPart(req, callback);
    function callback() {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            console.log('Incremented ' + req.body.name);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(req.body.name + ' was successfully incremented'));
        }
    }
});

router.post('/decrementPart', function(req, res) {
    console.log('Decrementing ' + req.body.name);
    decrementPart(req, callback);
    function callback() {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            console.log('Decremented ' + req.body.name);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(req.body.name + ' was successfully decremented'));
        }
    }
});

router.post('/incrementContainer', function(req, res) {
    console.log('Incrementing ' + req.body.name);
    incrementContainerPart(req, callback);
    function callback() {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            console.log('Incremented ' + req.body.name);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(req.body.name + ' was successfully incremented'));
        }
    }
});

router.post('/decrementContainer', function(req, res) {
    console.log('Decrementing ' + req.body.name);
    decrementContainerPart(req, callback);
    function callback() {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            console.log('Decremented ' + req.body.name);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(req.body.name + ' was successfully decremented'));
        }
    }
});


router.post('/createPart', function(req, res) {
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

router.post('/createContainer', function(req, res) {
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

router.post('/createUser', function(req, res) {
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

router.post('/createCategory', function(req, res) {
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

module.exports = router;
