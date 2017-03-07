//note fetch is making
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:kendr:soybean88@localhost:5432/image_board');
const express = require('express');
const app = express();
const chalk = require('chalk');
var multer = require('multer');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + Math.floor(Math.random() * 99999999) + '_' + file.originalname);
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

app.get('/home', function(req, res) {
    console.log(54);
    var query = 'SELECT TOP 12 image, username, title, description FROM images ORDER BY created_at';
    db.query(query, function(err, results) {
        if(err) {
            console.log(err);
        } else {
            res.send(results.rows);
        }
    });
});


app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function() {
    console.log(`listening on ` + app.get('port'));
});
