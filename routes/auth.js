const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')
const {check} = require('express-validator/check')


router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/signup', check('email').isEmail().withMessage('Please enter a vaild email'), authController.postSignup)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.post('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.newPassword)

module.exports = router



