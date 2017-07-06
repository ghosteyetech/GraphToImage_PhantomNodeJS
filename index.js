var webshot = require('webshot');
const express = require('express');
const app = express();
var path = require('path');

const PORT = process.env.PORT || 3000;

var pg = require('pg');
pg.defaults.ssl = true;


//To get post request
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
  res.send('Hello World!')
});


//===============PostSQL===================================================================
app.get('/createtable', function (req, res) {
  createTable();
  res.send('create table');
});

app.get('/insertdata', function (req, res) {
  insertData('sam','alooooo');
  res.send('insert data...');
});

app.get('/getdata', function (req, res) {
  getData('sam');
  res.send('getting data....');
});

function createTable(){
  
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
     client.query('CREATE TABLE datatable (email TEXT NOT NULL, data TEXT NOT NULL)', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log(result.rows);
     });
  });

}

function insertData(email, data){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
       client.query('INSERT INTO datatable(email, data) VALUES ($1, $2)',[email, data], 
        function(err, result) {
          done();
          if(err){
            return console.error(err);
          } else{
            console.log("Results : ");
            console.log(result.rows);  
          }
          
       });
    });
}

function getData(email){
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
       client.query('SELECT * FROM datatable where email=$1',[email], 
        function(err, result) {
          done();
          if(err){
            
            return console.error(err);
          } else{
            console.log("Results : ");
            console.log(result.rows);  
            var results = result.rows;
            
            
          }
          
       });
    });
}
//===============PostSQL===================================================================

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
});