const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')
const {check, body} = require('express-validator/check')
const User = require('../models/user')


router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com') {
        //   throw new Error('This email address if forbidden.');
        // }
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 5 characters.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    })
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.post('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.newPassword)

module.exports = router



