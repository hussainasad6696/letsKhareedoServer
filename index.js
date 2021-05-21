const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var PartnersDetail = require('./models/PartnersModel');
var Products = require('./models/ProductsModel');
var Client = require('./models/ClientModel');
var SoldProducts = require('./models/SoldProductsModel')
var uploadData = require('./middleware/fileUpload.js')
const portHttp = process.env.PORT || 8000;
const portHttps = process.env.PORT || 8080;
var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RestApi_letsKhareedo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then((message) => {
    console.log('mongodb connected');
    //console.log(message.isConnected);
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use('/databaseEntryForm', uploadData);


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
        console.log("updateUser here");
        console.log("updateUser: ============="+JSON.stringify(req.body));
    });

    app.get('/crm', (req, res) => {
        PartnersDetail.find({}, function (err,partners) {
            console.log(partners+": data is here");
            res.render('index', {person: "Mian Hussain", partner: partners});
        });
    });

    app.post('/databaseEntryForm', (req, res) => {
        console.log(req.body);
        sortingProductData(req.body, res);
    });
    app.get('/databaseEntryForm', (req, res) => {
        res.render('DataBaseEntryFormPage');
    });
    
    function sortingProductData(data, res){
        for(i = 0; i < data.imagePath.length; i++){
            console.log("here");
            var product = {};
            if(data.imagePath[i] !== "" && data.price[i] !== "" && data.quantity[i] !== "" && data.description[i] !== ""
            && data.material[i] !== "" && data.brand[i] !== "" && data.type[i] !== "" && data.size[i] !== "")
            {
            product.imagePath = data.imagePath[i];
            product.price = data.price[i];
            product.quantity = data.quantity[i];
            product.description = data.description[i];
            product.material = data.material[i];
            product.brand = data.brand[i];
            product.type = data.type[i];
            product.size = data.size[i];
            var products = Products(product);
            console.log(products);
            products.save(products).then(item =>{
                // res.send('data saved to database');
                res.send("Saved");
            }).catch(err =>{
                res.status(400).send("unable to save data to database");
            });
        }else {
            console.log("Empty data so skipping");
        }
        }
    }


// zeenia's code

 app.get('/Sales-Sheet', (req, res) => {
     SoldProducts.find({}, (err, products)=>{
         console.log('Sold products are: '+products);
         res.render('Sales-Sheet', {});
     })
 });

app.post('/addClient', (req, res) => {
    const query = Client.where({phoneNumber: req.body.phoneNumber});
    if (query)
    {
        console.log('This phone number is already registered.');
        res.status(400).send('Phone number already registered.');
    }
    else{
        Client.create(req.body).then((client)=>{
            console.log('Client added: '+client);
            res.status(200).send('User added successfully.');
        })
    }
})

 app.post('/userLogin', (req, res)=>{
     Client.findOne({phoneNumber: req.phoneNumber})
     .then(client => {
         if (client){
            if (client.password  === req.password)
            {
               console.log('User login successful');
               res.sendStatus(200);
            }
            else{
                console.log('Invalid password');
                res.status(400).send('Invalid password');
            }
         }
         else{
             console.log('Phone number does not exist in database.');
             res.status(404).send('Invalid phone number.');
         }
     });
 });

app.post('/newOrder', (req, res)=>{
    client = req.uid;
    orderData = req.order;
    Client.findByIdAndUpdate({_id: mongoose.Types.ObjectId(client)}, 
    {$addToSet: {orderList: JSON.stringify(orderData)}},  
    {safe: true, upsert: true, new: true}, (err, result)=>{
        if (err){
            console.log(err);
        }
        else{
            console.log('Order added: '+ orderData);
            products = orderData.products;
            products.forEach(product =>{
                Products.findByIdAndUpdate({_id: mongoose.Types.ObjectId(product.productID)},
                {$inc: {quantity: -1}});
            });
        }});    // TODO: add pending status, but where?
});