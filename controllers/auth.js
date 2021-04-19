const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const nodeMailerSendgrid = require('nodemailer-sendgrid')


const transporter = nodemailer.createTransport(nodeMailerSendgrid({

    apiKey: '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'
}))


exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  console.log(message)
  if(message.length > 0){
    message = message[0]

  }else{
    message = null
  }
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
      });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash( 'error','Invalid email or password')
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash( 'error','Invalid email or password')
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};
exports.postLogout = (req, res, next) => {
  
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')

  })
}

exports.getSignup = (req, res, next) =>{
  let message = req.flash('error')
  console.log(message)
  if(message.length > 0){
    message = message[0]

  }else{
    message = null
  }
  res.render('auth/signup', {
    pageTitle: 'SignUp',
    path: '/signup',
    errorMessage: message
  })
}

exports.postSignup = (req, res, next)=>{
const email = req.body.email
const password = req.body.password
const confirmPassword = req.body.confirmPassword
User.findOne({email: email}).then(userDoc =>{
  if(userDoc){
    req.flash( 'error','email exists already, please pick a different one')
    return res.redirect('/signup')
  }
 return bcrypt
 .hash(password, 12)
  .then(hashPassword =>{

    const user = new User({
   email: email,
   password: hashPassword,
   cart:{items: []}
  })
  return user.save()

  })
}).then(result=>{
  res.redirect('/login')
   return transporter.sendMail({
    to: email,
    from:'garciaelco18@gmail.com',
    subject: 'Sign Up Succeeded',
    html:'<h1> You successfully signed up! </h1>'
  })

}).catch(err=>{
  console.log(err)
})
}