const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf');
const flash = require('connect-flash')
const multer = require('multer')
const MongoDBStore = require('connect-mongodb-session')(session)
const errorController = require('./controllers/error');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const https = require('https')



//const privateKey = fs.readFileSync('server.key')
//const certificate = fs.readFileSync('server.cert')
//  https.createServer({key:privateKey, cert: certificate},app)


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});



const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const User = require('./models/user')

const app = express();
const store = new MongoDBStore({
  uri: `mongodb+srv://eag58914:f1gztXpsqWRBhZdp@cluster0.ohyguvt.mongodb.net/test`,
  collection: 'sessions'
})
const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');

 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');
 const authRoutes = require('./routes/auth');

 const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'}) 

app.use(helmet())
app.use(compression())
app.use(morgan('combined', {stream:accessLogStream}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({secret:'my secret', resave:false, saveUninitialized: false, store:store}))
app.use(csrfProtection);
app.use(flash())


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {next(new Error())
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
 app.use('/admin', adminRoutes);
 app.use(shopRoutes);
 app.use(authRoutes);

 app.get('/500', errorController.get500)
 app.use((error, req,res,next)=>{
   res.status(500).render('500',{
     pageTitle: 'Error!',
     page:'500',
     isAuthenticated: req.session.isLoggedIn
   })
 })

app.use(errorController.get404);


mongoose.connect( `mongodb+srv://eag58914:f1gztXpsqWRBhZdp@cluster0.ohyguvt.mongodb.net/test`, 
{ useNewUrlParser: true, useUnifiedTopology:true, ssl:true, sslValidate:false,   },)
.then(
  app.listen(process.env.PORT || 3000)
)
  .catch(error=>{
  console.log(error)
})
