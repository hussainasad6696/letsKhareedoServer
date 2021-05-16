const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var PartnersDetail = require('./models/PartnersModel');
const portHttp = process.env.PORT || 8000;
const portHttps = process.env.PORT || 8080;
var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RestApi_letsKhareedo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('mongodb connected');
});
app.use(bodyParser.urlencoded({extended: false}));


    const sslServer = https.createServer({
        key: fs.readFileSync('./sslCert/key.pem'),
        cert: fs.readFileSync('./sslCert/cert.pem')
    }, app);
    sslServer.listen(portHttps, () => console.log("HTTPS server started on port " + portHttps));

    const httpServer = http.createServer(app);
    httpServer.listen(portHttp, () => console.log("Http server started on port " + portHttp));
   
    app.get('/', (req, res) =>{
        var requestCheck;
        if(req.secure){
            requestCheck = "===========Request for https================";
        }else requestCheck = "===========Request for http================";
        console.log(requestCheck);
        res.send(requestCheck);
    });

    app.post('/partnersFormData', (req, res) =>{
        console.log("i am here in partnersFormData")
        var partnersData = new PartnersDetail(req.body);
        res.send(partnersData);
        console.log(req.body.partnerName_first+" "+req.body.partnerName_last);
    });

    app.get('/partnersForDataPage', (req, res) =>{
        res.sendFile('crm_site/Partner_Update_Form.html', {root: __dirname});
    });

