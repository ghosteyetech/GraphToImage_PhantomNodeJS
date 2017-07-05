var webshot = require('webshot');
const express = require('express');
const app = express();
var path = require('path');

const PORT = process.env.PORT || 3000;

var pg = require('pg');
pg.defaults.ssl = true;

var fileName = "image.png";
var imageFolder = __dirname + '/images/';
var imageSavinPath = imageFolder + fileName;

//=======Method-01
/*
var fs = require("fs");

var options = {
    siteType:'html'
};

webshot(fs.readFileSync("pages/highcharts/index.html", "UTF-8"), imageSavinPath, options, (err) => {
  // screenshot now saved to hello_world.png
});
*/
//=====================End

//==================Method-03
/*var options = {
    siteType: "file"
};

webshot("pages/highcharts/index.html", imageSavinPath, options, (err) => {
    if(err){
        return console.log(err);
    }

    console.log("Image succesfully created");
});*/
//===========================end

///=======Method-02
/*
var options = {
    onLoadFinished: function() {
        var links = document.getElementsByTagName('a');

        for (var i=0; i<links.length; i++) {
            var link = links[i];
            link.innerHTML = 'My custom text';
        } 
    }
};

webshot('www.buzzflow.io', imageSavinPath , options, (err) => {
  // screenshot now saved to google.png
});

*/


var dataJSON = "";

//To get post request
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/buzz/charts', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    dataJSON = geo;
    res.send(user_id + ' ' + token + ' ' + geo);
});


app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/new', function (req, res) {
  res.send('Hello Worldsxsxsx!')
});

app.get('/buzzdata', function (req, res) {
  dataJSON = [
    [1,12],
    [2,5],
    [3,18],
    [4,13],
    [5,7],
    [6,4],
    [7,9],
    [8,10],
    [9,15],
    [10,22]
  ];
  res.send(dataJSON);
});

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

//Load HTML
app.use(express.static('pages'));
app.get('/charts', function(req, res) {
    res.sendFile(path.join(__dirname + '/pages/highcharts/index.html'));
});
//Serving other dependecies scripts for hightcharts
app.get('/src/:name', function(req, res) {
    var fileName = req.params.name;
    res.sendFile(path.join(__dirname + '/pages/highcharts/src/'+fileName));
});

//
app.get('/save', function(req, res) {
    var options = {
        onLoadFinished: function() {
            var links = document.getElementsByClassName("highcharts-credits");///document.getElementsByTagName('text');

            for (var i=0; i<links.length; i++) {
                var link = links[i];
                link.innerHTML = 'My custom text';
                link.innerText = 'ghost';
            } 
        },
        renderDelay : 2000,
        captureSelector : "#container"
    };

    webshot('https://buzz-graph.herokuapp.com/charts', options, function (err, renderStream) {
      
      console.log("image captured...");
      var imageBuffers = [];

      renderStream.on('data', function (data) {
        imageBuffers.push(data);
      });

      renderStream.on('end', function () {
        var imageBuffer = Buffer.concat(imageBuffers);

        // Do something with your buffer (imageBuffer);

        // screenshot now saved to google.png
        res.end(imageBuffer, 'binary');


      });

    });

});

//


//Send image file
app.get('/file/:name', function (req, res, next) {

  var options = {
    root: imageFolder,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });

});

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
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