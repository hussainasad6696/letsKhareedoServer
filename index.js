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
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('mongodb connected');
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');


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
    
    var userName;

    var dbDataCheck = false;
    var id;
    app.get('/partnersForDataPage', (req, res) => {
        var firstName;
        var lastName;
        console.log(userName+"====================="+ req.body);
        // PartnersDetail.findOne({partnerName_first: userName}, 
        //     function(err,partners) {
        //         console.log("getMethod of partnersForDataPage: "+ partners);
        //         // partners.forEach(function(partner) {
        //             console.log(partners);
        //             if(userName !== null || userName !== "" && 
        //             userName === partners.partnerName_first || userName === partners.partnerName_last){
        //                 firstName = partners.partnerName_first;
        //                 lastName = partners.partnerName_last;
        //                 id = partners._id;
        //             }
        //         // });  
        //     })
        // .then((partners, err) => {
        //     if(err) {
        //         console.log(err);
        //     return;
        // }
        //     if(partners.length > 0) {
        //         console.log(partners);

        //     }else {
        //     console.log("db is empty so inserting new data");
        //     }
        //     res.render('Partner_Update_Form', {partnerName: userName, fName: firstName, lName: lastName});

        // }).catch(function(err) {
        //     console.log(err+"error when loading")
        // });
    });

    app.post('/partnersForDataPage', (req, res) =>{
        PartnersDetail.findOneAndUpdate({partnerName_first: req.body.partnerName_first},
            req.body,
             {
                 projection: {_id: 1, partnerName_first: 1,
                 partnerName_last: 1}}, function(error,data){
                 if(!error)
                    {
                        console.log("data get: "+data);
                        if(!data){
                            data = new PartnersDetail(req.body);
                        }
                        data.save().then(item =>{
                                    // res.send('data saved to database');
                                    res.redirect('/crm');
                                }).catch(err =>{
                                    res.status(400).send("unable to save data to database");
                                });
                }
             }).then((data, err) => {
                if(err) {
                    console.log("error++++++++++++++++++++"+err);
                return;
            }    
            }).catch(function(err) {
                console.log(err+"error when posting")
            });
      
        console.log("i am here in partnersFormData")
        console.log(req.body.partnerName_first+" "+req.body.partnerName_last);
    });
    app.post('/updateUser', (req, res) => {
        console.log("updateUser: ============="+JSON.stringify(req.body));
    });

    app.get('/crm', (req, res) => {
        PartnersDetail.find({}, function (err,partners) {
            console.log(partners+": data is here");
            res.render('index', {person: "Mian Hussain", partner: partners});
        });
    });

// zeenia's code
 app.get('/Sales-Sheet', (req, res) => {
     SoldProducts.find({}, (err, products)=>{
         console.log('Sold products are: '+products);
         res.render('Sales-Sheet', {});
     })
 });