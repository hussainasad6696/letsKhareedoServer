const https = require('https');
//const http = require('http');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const alert = require('alert');
const multiparty = require('multiparty');
const session = require('express-session');
global.constants = require('./constants');
const path = require("path");
const multer = require('multer');
const nodemailer = require('nodemailer');
var PartnersDetail = require('./models/PartnersModel');
var Products = require('./models/ProductsModel');
var Client = require('./models/ClientModel');
var SoldProducts = require('./models/SoldProductsModel');
var Orders = require('./models/OrderModel');
var UserData = require('./models/UserDataModel');
const DIR = './public/uploads';
const SLIDER_DIR = DIR + '/slider';
const ADD_IMAGES_DIR = DIR + '/advertisement';
const { render } = require('ejs');


//const portHttp = process.env.PORT || 8000;
const portHttps = process.env.PORT || 8080;
var app = express();


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RestApi_letsKhareedo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then((message) => {
    console.log('mongodb connected');
});


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
//app.use(express.bodyParser());
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(session({secret:'app',cookie:{maxAge:6000}, resave: false,
saveUninitialized: true}));

var checkUser = function(req,res,next){
    if(req.session.loggedIn){
      next();
    }else{
      res.render('adminLogin',{title:"Login Here"});
    }
  };

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zeeniaather96@gmail.com',
      pass: 'hussain4lyf'
    }
});

    const sslServer = https.createServer({
        key: fs.readFileSync('./sslCert/key.pem'),
        cert: fs.readFileSync('./sslCert/cert.pem')
    }, app);
    sslServer.listen(portHttps, () => console.log("HTTPS server started on port " + portHttps));

    // const httpServer = http.createServer(app);
    // httpServer.listen(portHttp, () => console.log("Http server started on port " + portHttp));
   
    app.get('/', checkUser, (req, res) =>{
        var requestCheck= "===========Request for https================";
        console.log(requestCheck);
        res.send(requestCheck);
    });

    app.get(constants.PARTNERS_FOR_DATAPAGE, (req, res) => {
        console.log(req);
        userName = req.query.userName;
        res.render('Partner_Update_Form', {userName: userName});
    });

    app.post(constants.PARTNERS_FOR_DATAPAGE, (req, res) =>{
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
                                    res.redirect('/dashboard');
                                }).catch(err =>{
                                    res.status(400).send("unable to save data to database");
                                });
                }
             }).then((data, err) => {
                if(err) {
                    console.log("error++++++++++++++++++++"+err);
            }    
            }).catch(function(err) {
                console.log(err+"error when posting")
            });
      
        console.log("i am here in partnersFormData")
        console.log(req.body.partnerName_first+" "+req.body.partnerName_last);
    });


    app.get(constants.UPDATE_USER, async (req, res) =>{
        console.log(req.params.email);
        userName = req.params.email;
        res.render('Partner_Update_Form.ejs', {userName: userName});
    })

    app.post(constants.UPDATE_USER, (req, res) => {
        let form = new multiparty.Form();
        console.log(req.body);
        const update = { partnerName: req.body.userName, latestInvestment: req.body.latestInvestment, date: req.body.date, investmentDate_timeInput: req.body.investmentDate_timeInput, investmentDate_ampm: req.body.investmentDate_ampm };
        PartnersDetail.findOneAndUpdate({partnerName: req.params.email}, update).then((result) => {
            PartnersDetail.findByIdAndUpdate(result._id, {$inc : {investment : parseInt(req.body.latestInvestment)}}).then((fin)=>{
                console.log('Updates partner: '+fin);
                res.status(200).send('Partner updated successfully.');
            })
        })
    });

    

    app.get(constants.DASHBOARD, (req, res) => {
        PartnersDetail.find({}, function (err,partners) {
            console.log(partners+": data is here");
            res.render('index', {person: "Mian Hussain", partner: partners});
        });
    });

    app.get(constants.DATABASE_ENTRY_FORM, (req, res) => {
        res.render('DataBaseEntryFormPage');
    });
    
    function sortingProductData(data, res){
        var number = parseInt(data.items);
        if (number === 1){
            console.log('save for one')
            var product = Products(data);
            console.log(product);
            product.save(product).then(item =>{
                // res.send('data saved to database');
                res.send("Saved");
            }).catch(err =>{
                res.status(400).send("unable to save data to database");
            });
        }else{
            console.log('save for multiple')
         for(i = 0; i < number; i++){
            console.log("here");
            var product = {};
            if(data.imagePath[i] !== "" && data.price[i] !== "" && data.quantity[i] !== "" && data.description[i] !== ""
            && data.material[i] !== "" && data.brand[i] !== "" && data.type[i] !== "" && data.size[i] !== ""
            && data.name !== "")
            {
            product.imagePath = data.imagePath[i];
            product.price = data.price[i];
            product.quantity = data.quantity[i];
            product.description = data.description[i];
            product.material = data.material[i];
            product.brand = data.brand[i];
            product.type = data.type[i];
            product.size = data.size[i];
            product.gender = data.gender[i];
            product.kids = data.kids[i];
            product.hotOrNot = data.hotOrNot[i];
            product.name = data.name[i];
            product.chest = data.chest[i];
            product.shoulder = data.shoulder[i];
            product.waist = data.waist[i];
            var products = Products(product);
            console.log(products);
            products.save(products).then(item =>{
                // res.send('data saved to database');
                res.send("Saved");
            }).catch(err =>{
                res.send("unable to save data to database");
            });
        }else {
            console.log("Empty data so skipping");
        }
        }
    }
    }


    function makeDirectory(){
        fs.mkdir(SLIDER_DIR, {recursive: true}, function(err){
            if(err){
                console.log(err);
            }
        });
        fs.mkdir(ADD_IMAGES_DIR , { recursive : true}, function(err){
            if(err){
                console.log(err);
            }
        })
    }
    makeDirectory();
    const storage = multer.diskStorage({
        destination : function(req, file, cb){
            if(req.body.slider === "slider")
            cb(null, SLIDER_DIR);
            else if(req.body.addvert === "addvert")
            cb(null, ADD_IMAGES_DIR);
            else
            cb(null, DIR);
        },
        filename : function(req, file, cb){
            console.log(`${JSON.stringify(req.body.slider)}==============filename=`)
            cb(null, `${file.originalname}`);
        }
    });

    const upload = multer({storage});

    app.post(constants.ADVERTISEMENT_IMAGE, upload.array("image"), (req, res) => {
        res.send("Saved");
    })

    app.post(constants.ADVERTISEMENT_SLIDER_IMAGE, upload.array("image" , 3), (req, res) => {
        res.send("Saved");
    })

    app.post(constants.SAVE_ADVERT_IMAGE, upload.array("image"), (req, res) => {
        res.send("Saved");
    })
    
    app.post(constants.DATABASE_ENTRY_FORM, (req, res) => {  
        console.log(req.body);
        sortingProductData(req.body, res);
    });

    app.get(constants.SLIDER_IMAGE, (req, res) => {
        var imagesList = [];
        const pathOfSliderImages = path.join(__dirname, 'public/uploads/slider');
        fs.readdir(pathOfSliderImages, function(err, files){
            if(err){
               return console.log(`${err} from image reading`)
            }
            files.forEach(function(file){
                imagesList.push(file);
            })
            res.send(imagesList);
        })
    })

    app.get(constants.ADVERTISEMENT, (req, res) => {
        var imageList = [];
        const pathOfAdds = path.join(__dirname, 'public/uploads/advertisement');
        fs.readdir(pathOfAdds, function (err, files) {
            if(err) {
                return console.log(err+ "from reading advertisement folder");
            }
            files.forEach(function(file) {
                imageList.push(file);
            })
            console.log(imageList);
            res.send(imageList);
        })
    })


// zeenia's code

app.get('/index', (req, res) => {
    if(req.session.loggedIn)
    PartnersDetail.findOne({email: req.body.Submit})
    .then((partner)=>{
        console.log(partner.verifKey);
        console.log(req.body.key);
        if(partner.verifKey === req.body.key){
            PartnersDetail.find({}, function (err,partners) {
                console.log(partners+": data is here");
                SoldProducts.find({}).then((sprods)=>{
                    Products.find({}).then((products)=>{
                        res.render('index', {person: partner.partnerName, partners: partners, soldproducts: sprods, allproducts: products});
                    })
                })
            });
        }
})
});

 app.get(constants.SALES_SHEET, (req, res) => {
     SoldProducts.find({}, (err, products)=>{
         console.log('Sold products are: '+products);
         res.render('Sales-Sheet', {});
     })
 });

app.get(constants.ADMIN_LOGIN, checkUser, (req,res)=>{
    res.render('adminLogin');
})

app.get(constants.LOGOUT, (req, res)=>{

    req.session.loggedIn=false;
    res.redirect(constants.ADMIN_LOGIN);
    console.log('User logged out.')
})

app.get(constants.VERIFICATION, (req, res)=>{   // testing done
    email = req.query.email;
    password = req.query.password;
    PartnersDetail.findOne({email: req.query.email})
     .then(partner => {
        if (partner){
           if (partner.password  === req.query.password)
           {
              console.log('User logged in.');
              var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
              var mailOptions = {
                from: 'zeeniaather96@gmail.com',
                to: req.query.email,
                subject: 'Verification Key',
                text: `Your verification key is ${seq}.`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error+"hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                } else {
                    PartnersDetail.findByIdAndUpdate({_id: partner._id}, {verifKey: seq})
                    .then(()=>{
                        console.log('Email sent to admin '+info);
                    })
                }
              });
              console.log(email);
              res.render('verif-key', { email : req.query.email }); //here
           }
           else{
               console.log('Invalid password');
               res.status(400).send('Invalid password');
           }
        }
        else{
            console.log('Email does not exist in database.');
            res.status(404).send('Invalid email.');
        }
})
});

// app.get(constants.VERIF_KEY_MAIL, (req, res)=>{
//     console.log(req.params.email);
//     res.render(constants.VERIF_KEY, { 'email' : req.params.email });
// });

app.get(constants.ADD_CUSTOMER, (req, res)=>{
    res.render('addClient');
});


// adding app using clients to db and checking their uniqueness
app.post(constants.ADD_CUSTOMER, (req, res)=>{
    console.log(req.body+ ": a new user is added to db");
    let form = new multiparty.Form();
    Client.findOne({phoneNumber: req.body.phoneNumber}, (err,clients)=>{
        if(err) {console.log(err + ": error while checking if client already exists or not");}
        if(clients){
            res.status(500).send("User already exists");
        }
        else {
            var client = Client(req.body);
                client.save().then((response)=>{
                    console.log('Customer added to database'+response);
                    Client.findByIdAndUpdate({_id:client._id}, {verificationStatus: 'non-verified'});
                    res.status(200).send('Customer saved.');
                    var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
              var mailOptions = {
                from: 'zeeniaather96@gmail.com',
                to: client.email,
                subject: 'Verification Key',
                text: `Your verification key is ${seq}.`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error+"hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                } else {
                    Client.findByIdAndUpdate({_id: client._id}, {verificationCode: seq})
                    .then(()=>{
                        console.log('Verification email sent to client '+info);
                    })
                }
              });
              res.render('verif-key', { email : client.email });
                }).catch((err)=>{
                console.log(err+": add user error =========================================");
            });
        }
    });
});

app.get(constants.ADD_PARTNER, (req, res)=>{       //testing done
    res.render('addPartner');
});

app.post(constants.ADD_PARTNER, (req, res)=>{       //testing done
    console.log('Adding partner: '+req.body);
    let form = new multiparty.Form();
    PartnersDetail.findOne({email: req.body.email}, (err, partners)=>{
        if(partners){
            res.send('Partner already exists.');
        }
        else{
            PartnersDetail.create(req.body).then((partner)=>{
                console.log('Partner added to database: '+partner);
                PartnersDetail.findByIdAndUpdate({_id: partner._id},
                    {status: 'nil'});
                res.status(200).send('Partner added to database.');
            })
        }
    })
});

app.post(constants.VERIF_KEY, (req, res)=>{    // testing done
    console.log(req.body);
    PartnersDetail.findOne({email: req.body.Submit})
    .then((partner)=>{
        if(partner.status == 'active')
        {
            PartnersDetail.find({}).then((partners)=>{
                SoldProducts.find({}).then((sprods)=>{
                    Products.find({}).then((products)=>{
                        res.render('index', {person: partner.partnerName, partners: partners, soldproducts: sprods, allproducts: products});
                    })
                })
            })
        }
        else if (partner.status == 'nil'){
            console.log(partner.verifKey);
            console.log(req.body.key);
            if(partner.verifKey === req.body.key){
                req.session.loggedIn=true;
                PartnersDetail.findByIdAndUpdate({_id: partner._id},
                {status: 'active'}).then(()=>{
                    console.log('Status active..');
                })
                console.log('here1');
                PartnersDetail.find({}, function (err,partners) {
                    console.log(partners+": data is here");
                    SoldProducts.find({}).then((sprods)=>{
                        Products.find({}).then((products)=>{
                            res.render('index', {person: partner.partnerName, partners: partners, soldproducts: sprods, allproducts: products});
                            //res.redirect('/index', {person: partner.partnerName, partners: partners, soldproducts: sprods, allproducts: products});
                        })
                    })
                });
            }
            else{
                alert('Wrong key entered. Try again.');
                res.render('verif-key');
            }
        }
    })
});

app.get(constants.USER_LOGIN, (req, res)=>{
    res.render('userLogin');
});

app.post(constants.USER_LOGIN, (req, res) => {
    Client.findOne({email: req.body.email}).then((client)=>{
        if (client){
            if (client.email  === req.body.email)
           {
              console.log('User login successful');
              res.status(200).send(client);
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
    })
});

app.post(constants.NEW_ORDER, (req, res)=>{
    console.log(req.body);
    client = req.body.uid;
    orderData = req.body.order;
    Client.findByIdAndUpdate({_id: mongoose.Types.ObjectId(client)}, 
    {$addToSet: {orderList: JSON.stringify(orderData)}},  
    {safe: true, upsert: true, new: true}, (err, result)=>{
        if (err){
            console.log(err);
        }
        else{
            console.log('Order added: '+ result);
            products = orderData.products;
            const update = {customerID: result._id, customerName: result.name};
            Orders.create(orderData).then((order)=>{
                Orders.findByIdAndUpdate({_id: order._id}, update);
            })
            products.forEach(product =>{
                Products.findByIdAndUpdate({_id: mongoose.Types.ObjectId(product.productID)},
                {$inc: {quantity: -1, pending: 1}});
            });
            res.status(200).send('Order has been placed.');
        }});
});

app.get(constants.MALE_PRODUCTS, (req, res)=>{
    Products.find({gender: 'male'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.get(constants.FEMALE_PRODUCTS, (req, res)=>{
    Products.find({gender: 'female'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.get(constants.MALE_KIDS_PRODUCTS, (req, res)=>{
    Products.find({gender: 'male', kids: 'yes'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.get(constants.FEMALE_KIDS_PRODUCTS, (req, res)=>{
    Products.find({gender: 'female', kids: 'yes'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.post(constants.SOLD_PRODUCTS, (req, res)=>{
    console.log(req.body);
    SoldProducts.create(req.body).then((prod)=>{
        console.log('Product added to sold database: '+prod);
    })
})

app.post(constants.ADD_PRODUCTS, (req, res)=>{
    console.log(req.body);
    Products.create(req.body).then((prod)=>{
        console.log('Product added to database: '+prod);
    })
})

app.get(constants.ACCESSORIES_PRODUCTS, (req, res)=>{
    Products.find({type: 'accessories'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.get(constants.PRODUCTS_STORE, (req, res)=>{
    Products.find()
    .then((prod)=>{
        res.send(prod);
    })
});

app.get(constants.PRODUCT_IMAGES, (req, res) => {
    console.log(req.query.id);
    id = req.query.id;
    fp = "./public/uploads/"+id;
    res.sendFile(fp, { root: __dirname });
    // res.send(fp);
});

app.get(constants.PRODUCT_SLIDER_IMAGES, (req, res) => {
    id = req.query.id;
    fp = "./public/uploads/slider/"+id;
    res.sendFile(fp, { root: __dirname });
})

app.get(constants.PRODUCT_ADVERT_IMAGES, (req, res) => {
    id = req.query.id;
    fp = ADD_IMAGES_DIR+"/"+id;
    res.sendFile(fp, { root: __dirname });
})

app.get(constants.HOT_OR_NOT, (req, res)=>{
    Products.find({hotOrNot: 'yes'})
    .then((prod)=>{
        res.send(prod);
    })
});

app.get('/test', (req, res)=>{
    var mailOptions = {
        from: 'zeeniaather96@gmail.com',
        to: 'mianhussainasad@gmail.com',
        subject: 'Verification Key',
        text: 'Your verification key is 1234.'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log('Email sent to admin '+info);
        }
      });
})

app.get(constants.ORDER_LIST, (req, res)=>{
    Orders.find({}).then((orders)=>{
        res.render('OrderList', {userName: 'zinnia', partners:['a', 'b']});
    })
})

app.get(constants.STOCK_ENTRY, (req, res)=>{
    res.render('DataBaseEntryFormPage');
})

app.get('/dataEntry', (req, res)=>{
    res.render('DataBaseEntryFormPage.ejs');
})