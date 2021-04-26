const crypto = require('crypto')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const nodeMailerSendgrid = require('nodemailer-sendgrid')
const {validationResult} = require('express-validator/check')


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
const errors = validationResult(req)
if(errors.isEmpty()){
  console.log(errors)
  return res.status(422).render( res.render('auth/signup', {
    pageTitle: 'SignUp',
    path: '/signup',
    errorMessage: errors.array()[0].msg
  }))

}
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

exports.getReset = (req, res, next) =>{
  let message = req.flash('error')
  console.log(message)
  if(message.length > 0){
    message = message[0]

  }else{
    message = null
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) =>{
 crypto.randomBytes(32,(err,buffer)=>{
   if(err){
     console.log(err)
     return res.redirect('/reset')
   }
   const token = buffer.toString('hex')
   User.findOne({email:req.body.email}).then(user=>{
     if(!user){
       req.flash('error', 'no account with that email was found')
       return res.redirect('/reset')
     }
     user.resetToken = token
     user.resetTokenExpiration = Date.now() + 3600000
    return  user.save()
   })
   .then(
    result =>{
      res.redirect('/login')
    return transporter.sendMail({
    to: req.body.email,
    from:'garciaelco18@gmail.com',
    subject: 'Password Reset',
    html:
    `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
  })
    })
  })
  }

  exports.getNewPassword = (req, res, next) =>{
const token = req.params.token
User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now() }}).then(user=>{

  let message = req.flash('error')
  console.log(message)
  if(message.length > 0){
    message = message[0]

  }else{
    message = null
  }
    res.render('auth/new-password', {
    pageTitle: 'Reset Password',
    path: '/new-password',
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: token
  })
}).catch(err=>{
  console.log(err)
})
  }

  exports.newPassword = (req, res, next) =>{
    const newPassword = req.body.password 
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId}).then(user=>{
     return bcrypt.hash(newPassword, 12)
     .then(hashPassword=>{
      resetUser.password = hashPassword
      resetUser.token = null
      resetUser.resetTokenExpiration = undefined
      resetUser.save() 
     }).then(result=>{
       res.redirect('/login')
     })

    }).catch(err=>{
      console.log(err)
    })

  }