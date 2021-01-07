const express = require('express')
const router = express.Router()
const mysql = require('mysql')
require('dotenv').config()
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'WMSInventory'
})

// ***Queries*** //
function getItems (req, context, callback) {
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

function filterItems (req, context, callback) {
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

function deleteItem (req, callback) {
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

// ***UPDATE Quantity Queries*** //
function incrementPart (req, callback) {
  let sql = mysql.format('UPDATE wmsinventory.Parts SET partQuantity = partQuantity + ? WHERE name = ?', [
    req.body.partQuantity,
    req.body.name
  ])
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '')
    }
  connection.query(sql, function (err) {
    if (err) {
      throw err
    }
    callback()
  })
}

function decrementPart(req, callback) {
    let sql = mysql.format('UPDATE wmsinventory.Parts SET partQuantity = partQuantity - ? WHERE name = ? AND partQuantity > 0', [
        req.body.partQuantity,
        req.body.name
    ])
    for (let i = 0; i < 2; i++) {
        sql = sql.replace(/["']/, '')
    }
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

function incrementContainerPart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers SET quantity = quantity + ? WHERE name = ?', [
        req.body.quantity,
        req.body.name
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

function decrementContainerPart(req, callback) {
    const sql = mysql.format('UPDATE wmsinventory.Containers SET quantity = quantity - ? WHERE name = ? AND quantity > 0', [
        req.body.quantity,
        req.body.name
    ])
    connection.query(sql, function (err) {
        if (err) {
            throw err
        }
        callback()
    })
}

// ***CREATE Queries*** //
function createPart (req, callback) {
  const sql = mysql.format('INSERT INTO wmsinventory.Parts (name, category, partQuantity, partLocation) VALUES (?, ?, ?, ?)', [
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

function createContainer (req, callback) {
  const sql = mysql.format('INSERT INTO wmsinventory.Containers (name, quantity, size, location, description) VALUES (?, ?, ?, ?, ?)', [
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

function createUser (req, callback) {
  const sql = mysql.format('INSERT INTO wmsinventory.Users (username, password) VALUES (?, ?)', [
    req.body.username,
    req.body.password
  ])
  connection.query(sql, function (err) {
    if (err) {
      throw err
    }
    callback()
  })
}

function createCategory (req, callback) {
  const sql = mysql.format('INSERT INTO wmsinventory.Categories (name) VALUES (?)', [
    req.body.name
  ])
  connection.query(sql, function (err) {
    if (err) {
      throw err
    }
    callback()
  })
}

// ***Test Routes*** //
router.get('/getItems', function (req, res) {
  console.log('Getting all ' + req.body.tables)
  const context = {}
  getItems(req, context, callback)
  function callback () {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(context.parts))
  }
})

router.get('/filterItems', function (req, res) {
  console.log('Filtering ' + req.body.table)
  const context = {}
  filterItems(req, context, callback)
  function callback () {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(context.filter))
  }
})

router.delete('/deleteItem', function (req, res) {
  console.log('Deleting ' + req.body.table)
  deleteItem(req, callback)
  function callback () {
    console.log('Deleted ' + req.body.filter)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(req.body.filter + ' was successfully deleted'))
  }
})

router.post('/incrementPart', function (req, res) {
    console.log('Incrementing ' + req.body.name)
    incrementPart(req, callback)
    function callback () {
        console.log('Incremented ' + req.body.name)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(req.body.name + ' was successfully incremented'))
    }
})

router.post('/decrementPart', function (req, res) {
    console.log('Decrementing ' + req.body.name)
    decrementPart(req, callback)
    function callback() {
        console.log('Decremented ' + req.body.name)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(req.body.name + ' was successfully decremented'))
    }
})

router.post('/incrementContainer', function (req, res) {
    console.log('Incrementing ' + req.body.name)
    incrementContainerPart(req, callback)
    function callback() {
        console.log('Incremented ' + req.body.name)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(req.body.name + ' was successfully incremented'))
    }
})

router.post('/decrementContainer', function (req, res) {
    console.log('Decrementing ' + req.body.name)
    decrementContainerPart(req, callback)
    function callback() {
        console.log('Decremented ' + req.body.name)
        res.setHeader('Content-Type', 'application/json')
        res.status(200).send(JSON.stringify(req.body.name + ' was successfully decremented'))
    }
})

router.post('/createPart', function (req, res) {
  console.log('Creating Part')
  createPart(req, callback)
  function callback () {
    console.log('Created ' + req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(req.body.name + ' was successfully added'))
  }
})

router.post('/createContainer', function (req, res) {
  console.log('Creating Container')
  createContainer(req, callback)
  function callback () {
    console.log('Created ' + req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(req.body.name + ' was successfully added'))
  }
})

router.post('/createUser', function (req, res) {
  console.log('Creating User')
  createUser(req, callback)
  function callback () {
    console.log('Created User')
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify('User was successfully added'))
  }
})

router.post('/createCategory', function (req, res) {
  console.log('Creating Category')
  createCategory(req, callback)
  function callback () {
    console.log('Created ' + req.body.name)
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(req.body.name + ' was successfully added'))
  }
})

router.route('/')
  .get(function (req, res, next) {
    res.send('API is working properly')
  })
module.exports = router
