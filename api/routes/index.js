const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'WMSInventory'
})

// ***Queries*** //
function getItems(req, context, callback) {
    let sql = mysql.format('SELECT * FROM wmsinventory.?', [
        req.body.table
    ])
    sql = sql.replace(/['"]/g, '')
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err
        }
        context.parts = rows
        callback()
    })
}

function filterItems(req, context, callback) {
    let sql = mysql.format('SELECT * FROM wmsinventory.? WHERE ? = ?', [
        req.body.table,
        req.body.criteria,
        req.body.filter
    ])
    for (let i = 0; i < 4; i++) {
        sql = sql.replace(/["']/, '')
    }
    connection.query(sql, function (err, rows) {
        if (err) {
            throw err
        }
        context.filter = rows
        callback()
    })
}

function deleteItem(req, callback) {
    let sql = mysql.format('DELETE FROM WMSInventory.? WHERE ? = ?', [
        req.body.table,
        req.body.criteria,
        req.body.filter
    ])
    for (let i = 0; i < 4; i++) {
        sql = sql.replace(/["']/, '')
    }
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

// ***CREATE Queries*** //
function createPart(req, callback) {
    let sql = mysql.format('INSERT INTO wmsinventory.Parts (name, category, partQuantity, partLocation) VALUES (?, ?, ?, ?)', [
        req.body.name,
        req.body.category,
        req.body.quantity,
        req.body.location
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

function createContainer(req, callback) {
    let sql = mysql.format('INSERT INTO wmsinventory.Containers (name, quantity, size, location, description) VALUES (?, ?, ?, ?, ?)', [
        req.body.name,
        req.body.quantity,
        req.body.size,
        req.body.location,
        req.body.description
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

function createUser(req, callback) {
    let sql = mysql.format('INSERT INTO wmsinventory.Users (username, password) VALUES (?, ?)', [
        req.body.username,
        req.body.password,
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

function createCategory(req, callback) {
    let sql = mysql.format('INSERT INTO wmsinventory.Categories (name) VALUES (?)', [
        req.body.name
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
