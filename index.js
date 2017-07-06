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

//==================================AM Charts
//GET
var buzzdata = null;
app.get('/buzzdata', function(req, res) {

  console.log("Getting buzzdata /buzzdatacolumn");
  console.log(buzzdata);
  res.send(buzzdata);    

});
//Serving other dependecies scripts for amcharts
app.get('/amcharts/:name', function(req, res) {
    var fileName = req.params.name;
    res.sendFile(path.join(__dirname + '/pages/amCharts/amcharts/'+fileName));
});

//POST
app.post('/buzz/charts', function(req, res) {

    var instance_id = req.body.instance_id;
    var type = req.body.type;
    var data = req.body.data;

    var viewOnly = req.body.viewonly;
    
    buzzdata = data;
    //res.send(instance_id + ' ' + type + ' column data' + data);
    console.log("============>Graph type :"+type);

    if(viewOnly && type == "column"){
      res.sendFile(path.join(__dirname + '/pages/amCharts/column.html'));
    }else if(viewOnly && type == "bar"){
      res.sendFile(path.join(__dirname + '/pages/amCharts/barStacked.html'));
    }else{
      getGraphImage(res, type);
    }

});

function getGraphImage(response, graphType){

  var options = {
        onLoadFinished: function() {
            /*var links = document.getElementsByClassName("highcharts-credits");///document.getElementsByTagName('text');

            for (var i=0; i<links.length; i++) {
                var link = links[i];
                link.innerHTML = 'My custom text';
                link.innerText = 'ghost';
            } */
        },
        renderDelay : 2000,
        captureSelector : "#chartdiv"
    };

    var captureUrl = 'http://localhost:3000/'+graphType;

    console.log("Url: "+captureUrl);

    webshot( captureUrl, options, function (err, renderStream) {
      
      var imageBuffers = [];

      renderStream.on('data', function (data) {
        imageBuffers.push(data);
      });

      renderStream.on('end', function () {
        var imageBuffer = Buffer.concat(imageBuffers);

        // Do something with your buffer (imageBuffer);

        // screenshot now saved to google.png
        response.writeHead(200, {'Content-Type': 'image/png' });
        response.end(imageBuffer, 'binary');


      });

    });

}
//==================================AM Charts

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