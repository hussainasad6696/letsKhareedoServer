const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
global.constants = require('./constants');
const path = require("path");
const multer = require('multer');
const nodemailer = require('nodemailer');
var PartnersDetail = require('./models/PartnersModel');
var Products = require('./models/ProductsModel');
var Client = require('./models/ClientModel');
var SoldProducts = require('./models/SoldProductsModel');
var UserData = require('./models/UserDataModel');
const DIR = './public/uploads';
const SLIDER_DIR = DIR + '/slider';
const ADD_IMAGES_DIR = DIR + '/advertisement';
const { render } = require('ejs');


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


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  extended: true
}));
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'letskhareedo@gmail.com',
      pass: 'yourpassword'
    }
});



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

    app.get(constants.PARTNERS_FOR_DATAPAGE, (req, res) => {
        var firstName;
        var lastName;
        //console.log(userName+"====================="+ req.body);
        res.render('Partner_Update_Form');
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

    app.post(constants.UPDATE_USER, (req, res) => {
        console.log("updateUser here");
        console.log("updateUser: ============="+JSON.stringify(req.body));
    });

    app.get(constants.DASHBOARD, (req, res) => {
        // email = req.params.email;
        // key = req.verifKey;
        // PartnersDetail.findOne({email: email})
        // .then((partner)=>{
        //     if(partner.verifKey === key){
                PartnersDetail.find({}, function (err,partners) {
                    console.log(partners+": data is here");
                    res.render('index', {person: "Mian Hussain", partner: partners});
                });
        //    }
        //     else{

        //     }
        // })
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
            }else {
                console.log("New directory created");
            }
        });
        fs.mkdir(ADD_IMAGES_DIR , { recursive : true}, function(err){
            if(err){
                console.log(err);
            }else console.log("Add Images Dir Created");
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
            console.log(imagesList + "  ==========list")
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

// app.post('/login/userData', (req, res) => {
//     var userData = UserData(req.body);
//     userData.save().then(() =>{
//         res.send(req.body);
//     }).catch(err =>{
//         console.log(err+" error on add userData");
//     });
// });



// zeenia's code


 app.get(constants.SALES_SHEET, (req, res) => {
     SoldProducts.find({}, (err, products)=>{
         console.log('Sold products are: '+products);
         res.render('Sales-Sheet', {});
     })
 });

app.get(constants.ADMIN_LOGIN, (req,res)=>{
    res.render('adminLogin');
})

app.get(constants.VERIFICATION, (req, res)=>{
    email = req.email;
    password = req.password;
    PartnersDetail.findOne({email: req.email})
     .then(partner => {
        if (partner){
           if (partner.password  === req.password)
           {
              console.log('User logged in.');
              var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
              var mailOptions = {
                from: 'letskhareedo@gmail.com',
                to: req.email,
                subject: 'Verification Key',
                text: `Your verification key is ${seq}.`
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                    PartnersDetail.findByIdAndUpdate({_id: partner._id}, {verifKey: seq})
                    .then(()=>{
                        console.log('Email sent to admin '+info);
                    })
                }
              });
              res.render(constants.VERIF_KEY+email);
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

app.get(constants.VERIF_KEY_MAIL, (req, res)=>{
    console.log(req.params.email);
    res.render(constants.VERIF_KEY, { 'email' : req.params.email });
});

app.get(constants.ADD_CUSTOMER, (req, res)=>{
    res.render('addClient');
});


// adding app using clients to db and checking their uniqueness
app.post(constants.ADD_CUSTOMER, (req, res)=>{
    console.log(req.body+ ": a new user is added to db");
    Client.findOne({phoneNumber: req.body.phoneNumber}, function(err,partners){
        if(err) {console.log(err + ": error while checking if client already exists or not");}
        if(partners){
            res.status(500).send("User already exists");
        }else {
            var client = Client(req.body);
                client.save().then(function(response){
            console.log(response+": add user response======================================");
            res.status(200).send('Saved');
            }).catch(function(err){
                console.log(err+": add user error =========================================");
    });
        }
    });
    
});

app.get(constants.ADD_PARTNER, (req, res)=>{
    res.render('addPartner');
});

app.post(constants.ADD_PARTNER, (req, res)=>{
    
});

app.post(constants.VERIF_KEY_MAIL, (req, res)=>{
    email =  req.params.email;
    PartnersDetail.findOne({email: req.email})
    .then((partner)=>{
        if(partner.verifKey === req.key){
            res.render('/dashboard');
        }
        else{
            alert('Wrong key entered. Try again.');
            res.render('verif-key');
        }
    })
});

 app.post(constants.USER_LOGIN, (req, res)=>{
     console.log(req.body+ ": userlogin data is here");
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

app.post(constants.NEW_ORDER, (req, res)=>{
    client = req.uid;
    orderData = req.order;
    Client.findByIdAndUpdate({_id: mongoose.Types.ObjectId(client)}, 
    {$addToSet: {orderList: JSON.stringify(orderData)}},  
    {safe: true, upsert: true, new: true}, (err, result)=>{
        if (err){
            console.log(err);
        }
        else{
            console.log('Order added: '+ result);
            products = orderData.products;
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
    console.log('Data sent.');
});

app.get(constants.PRODUCT_SLIDER_IMAGES, (req, res) => {
    console.log(req.query.id+"++++++++++++++++++++++++++++++++++++++++++++++");
    id = req.query.id;
    fp = "./public/uploads/slider/"+id;
    res.sendFile(fp, { root: __dirname });
})

app.get(constants.PRODUCT_ADVERT_IMAGES, (req, res) => {
    console.log(req.query.id+"++++++++++++++++++++++++++++++++++++++++++++++");
    id = req.query.id;
    fp = ADD_IMAGES_DIR+"/"+id;
    res.sendFile(fp, { root: __dirname });
})

app.get(constants.HOT_OR_NOT, (req, res)=>{
    Products.find({hotOrNot: 'yes'})
    .then((prod)=>{
        res.send(prod);
        console.log('Data sent.');
    })
});