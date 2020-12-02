require('dotenv').config({ path: '../.env' })

const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 3306,
  database: 'WMSInventory'
})

// ***Queries*** //
function getItems (req, callback) {
  let sql = mysql.format('SELECT * FROM wmsinventory.?', [
    req.body.table
  ])
  sql = sql.replace(/['"]/g, '')
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
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
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

function deleteItem (req, callback) {
  // TODO: Add check if item exists
  // TODO: Delete if exists otherwise give error code and message
  let sql = mysql.format('DELETE FROM WMSInventory.? WHERE ? = ?', [
    req.body.table,
    req.body.criteria,
    req.body.filter
  ])
  for (let i = 0; i < 4; i++) {
    sql = sql.replace(/["']/, '')
  }
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
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
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
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
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

function createUser (req, callback) {
  // TODO: Either encrypt password OR use a different oauth provider
  const sql = mysql.format('INSERT INTO wmsinventory.Users (username, password) VALUES (?, ?)', [
    req.body.username,
    req.body.password
  ])
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

function createCategory (req, callback) {
  const sql = mysql.format('INSERT INTO wmsinventory.Categories (name) VALUES (?)', [
    req.body.name
  ])
  connection.query(sql, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  })
}

// ***Test Routes*** //
router.get('/getItems', function (req, res) {
  console.log('Getting all ' + req.body.table)
  getItems(req, callback)
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
})

router.get('/filterItems', function (req, res) {
  console.log('Filtering ' + req.body.table)
  const context = {}
  filterItems(req, context, callback)
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
})

router.delete('/deleteItem', function (req, res) {
  console.log('Deleting ' + req.body.table)
  deleteItem(req, callback)
  function callback (err) {
    if (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(err.status || 400).json({status: err.status, message: err.message});
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(204).json();
    }
  }
})

router.post('/createPart', function (req, res) {
  console.log('Creating Part')
  createPart(req, callback)
  function callback (err, data) {
    if (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(err.status || 400).json({status: err.status, message: err.message});
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({
        id: data.insertId,
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        locaton: req.body.location
      });
    }
  }
})

router.post('/createContainer', function (req, res) {
  console.log('Creating Container')
  createContainer(req, callback)
  function callback (err, data) {
    if (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(err.status || 400).json({status: err.status, message: err.message});
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({
        id: data.insertId,
        name: req.body.name,
        quantity: req.body.quantity,
        size: req.body.size,
        location: req.body.location,
        description: req.body.description
      });
    }
  }
})

router.post('/createUser', function (req, res) {
  console.log('Creating User')
  createUser(req, callback)
  function callback (err, data) {
    if (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(err.status || 400).json({status: err.status, message: err.message});
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({
        id: data.insertId,
        username: req.body.username,
      });
    }
  }
})

router.post('/createCategory', function (req, res) {
  console.log('Creating Category')
  createCategory(req, callback)
  function callback (err, data) {
    if (err) {
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.status(err.status || 400).json({status: err.status, message: err.message});
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.status(201).json({
        id: data.insertId,
        name: req.body.name
      });
    }
  }
})

module.exports = router
