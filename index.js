//note fetch is making
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:kendr:soybean88@localhost:5432/image_board');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json());
app.use("/public", express.static(__dirname + '/public'));
app.use("/uploads", express.static(__dirname + '/public/uploads'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/images', function(req, res) {
    var query = 'SELECT id, image, username, title, description FROM images ORDER BY created_at LIMIT 12';
    db.query(query, function(err, results) {
        if(err) {
            console.log(err);
        } else {
            res.send({
                images: results.rows
            });
        }
    });
});

app.get('/image/:something', function(req, res) {
    var query = 'SELECT image, username, title, description FROM images WHERE id= $1';
    db.query(query, [req.params.something], function(err, result) {
        if(err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            var imageResults = result.rows;
            var query2 = 'SELECT image_id, comment, commenter FROM comments where image_id = $1 ORDER BY created_at';
            db.query(query2, [req.params.something], function(err, results) {
                if(err) {
                    console.log(err);
                } else {
                    var commentResults = results.rows;
                    res.send({
                        image: imageResults,
                        comments: commentResults
                    });
                }
            });
        }
    });
});


app.post('/image/comment/:image_id', function(req, res) {
    var image_id = req.params.image_id;
    console.log(image_id, req.body.commenter, req.body.comment);
    var query = 'INSERT INTO comments (image_id, comment, commenter) VALUES ($1, $2, $3)';
    db.query(query, [image_id, req.body.comment, req.body.commenter], function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("insert complete");
            res.redirect('/image/' + image_id);
        }
    });
});


app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), function() {
    console.log(`listening on ` + app.get('port'));
});
