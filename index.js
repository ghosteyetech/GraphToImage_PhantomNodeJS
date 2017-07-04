var webshot = require('webshot');
const express = require('express');
const app = express();
var path = require('path');


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


app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/new', function (req, res) {
  res.send('Hello Worldsxsxsx!')
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
        renderDelay : 500,
        captureSelector : "#container"
    };

    webshot('http://localhost:3000/charts', imageSavinPath , options, (err) => {
        // screenshot now saved to google.png
        //res.send('Success!!!!!')

        var fileName = imageSavinPath;
        res.sendFile(fileName, options, function (err) {
            if (err) {
            next(err);
            } else {
            console.log('Sent:', fileName);
            }
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
