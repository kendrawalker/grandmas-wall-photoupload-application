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

app.get('/', function(req, res){
    console.log(chalk.magenta(req.method, req.url));
    res.sendFile(__dirname + '/public/upload_file.html');
});

app.post('/', uploader.single('file'), function(req, res) {
    console.log(chalk.cyan(req.method, req.url));
    console.log(req.file);
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        res.json({
            success: true,
            file: '/uploads/' + req.file.filename
        });
    } else {
        res.json({
            success: false
        });
    }
});


app.listen(8080, function() {
    console.log(`listening`);
});
