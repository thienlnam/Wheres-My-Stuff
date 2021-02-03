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
 * Creates a CategorizedBy in the CategorizedBy table
 *
 * @param {*} req
 * @param {*} callback
 */
function createCategorized(req, callback) {
    const partID = req.params.pid;
    const categoryID = req.params.cid;
    const sql = mysql.format('INSERT INTO wmsinventory.CategorizedBY (partID, categoryID) VALUES (?, ?)', [
        partID,
        categoryID,
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
 * Deletes a CategorizedBy along with the filter and criteria
 *
 * @param {*} req
 * @param {*} callback
 */
function deleteCategorized(req, callback) {
    const partID = req.params.pid;
    const categoryID = req.params.cid;
    const deleteSQL = mysql.format('DELETE FROM wmsinventory.CategorizedBy WHERE partID = ? AND categoryID = ?', [
        partID,
        categoryID,
    ]);

    const selectSQL = mysql.format('SELECT * FROM wmsinventory.CategorizedBy WHERE partID = ? AND categoryID = ?', [
        partID,
        categoryID,
    ]);

    connection.query(selectSQL, function(err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            // Check if element exits
            if (!result[0]) {
                callback({status: 404, message: 'Specified categorizedBy does not exist'});
            } else {
                // CategorizedBy exists, perform update
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

router.post('/Category/:cid/Parts/:pid', function(req, res) {
    console.log('Adding category to part');
    createCategorized(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', 'application/json');
            res.status(err.status || 400).json({status: err.status, message: err.message});
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json();
        }
    }
});


router.delete('/Category/:cid/Parts/:pid', function(req, res) {
    console.log('Deleting CategorizedBy');
    deleteCategorized(req, callback);
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
