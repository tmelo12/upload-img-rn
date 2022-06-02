const express = require('express');
const router = require('./routes')
const app = express();
var multer = require('multer');
var upload = multer();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 

app.use(router);

// for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


app.listen(3000, function(){
    console.log("API na 3000");
})