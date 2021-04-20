const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth')


router.get('/login', authController.getLogin)
router.get('/signup', authController.getSignup)
router.post('/login', authController.postLogin)
router.post('/logout', authController.postLogout)
router.post('/signup', authController.postSignup)
router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)
router.post('/reset/:token', authController.getNewPassword)
router.post('/new-password', authController.newPassword)

module.exports = router



