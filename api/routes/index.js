const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'master',
  password: 'Wh3r3$MyStuff',
  database: 'WMSInventory'
})


function filterParts(table, criteria, filter, context, callback) {
  var sql = 'SELECT * FROM wmsinventory.' + table + ' WHERE ' + criteria + '=' + filter
  connection.query(sql, function (err, rows) {
    if (err) {
      throw err
    }
    context.filter = rows
    return callback()
  })
}

router.get('/filterParts', function (req, res) {
  console.log('Filtering parts')
  var context = {}
  var criteria = 'name'
  var filter = '\"Jackhammer\"'
  filterParts('Parts', criteria, filter, context, callback)
  function callback() {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(context.filter))
  }
})


function getParts(table, context, callback) {
  var sql = 'SELECT * FROM wmsinventory.' + table
  connection.query(sql, function (err, rows) {
    if (err) {
      throw err
    }
    context.parts = rows
    callback()
  })
}

router.get('/getParts', function (req, res) {
  console.log('Getting all parts')
  var context = {}
  getParts('Parts', context, callback)
  function callback() {
    res.setHeader('Content-Type', 'application/json')
    res.status(200).send(JSON.stringify(context.parts))
  }
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
