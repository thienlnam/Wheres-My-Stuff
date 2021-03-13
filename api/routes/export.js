require('dotenv').config({ path: '../.env' });

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { Parser } = require('json2csv');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 3306,
    database: 'wmsinventory',
    multipleStatements: true,
});

/**
 * Export the database to a CSV file
 *
 * @param {*} req
 * @param {*} callback
 */
function exportData(req, callback) {
    const sql = "SELECT P.name AS PartName, C.name AS ContainerName, C.location AS Location, C.size AS ContainerSize, C.description AS Description, CB.quantity AS PartQuantity, CB.identifier AS Identifier FROM ContainedBy CB, Parts P, Containers C WHERE P.partID = CB.partID AND C.containerID = CB.containerID;"
    connection.query(sql, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

router.get('/', function (req, res) {
    console.log('Exporting Data');
    exportData(req, callback);
    function callback(err, data) {
        if (err) {
            console.log(err);
            res.setHeader('Content-Type', '*/*');
            res.status(err.status || 400).json({ status: err.status, message: err.message });
        } else {
            const fields = ['PartName', 'ContainerName', 'ContainerLocation', 'ContainerSize', 'ContainerDescription', 'ContainerQuantity', 'ContainerIdentifier'];
            const opts = { fields };

            try {
                const parser = new Parser({ opts });
                const csv = parser.parse(JSON.parse(JSON.stringify(data)));
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="export.csv"')
                res.status(201).end(csv);
            } catch (parseErr) {
                console.log(parseErr);
                res.setHeader('Content-Type', '*/*');
                res.status(400).json({ message: parseErr.message });
            } 
        }
    }
});

module.exports = router;
