const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth')

const {body} =require('express-validator')


// // /admin/add-product => GET
  router.get('/add-product',[
    body('title').isString().isLength({min:3}).trim(),
    body('imageUrl').isURL(),  
    body('price').isFloat(), 
    body('description').isLength({min:3,max:200})
  ], isAuth, adminController.getAddProduct);

// // // /admin/products => GET
 router.get('/products',isAuth, adminController.getProducts);

// // /admin/add-product => POST
 router.post('/add-product', isAuth,adminController.postAddProduct);
 // admin edit product

  router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

  router.post('/edit-product',[
    body('title').isString().isLength({min:3}).trim(),
    body('price').isFloat(), body('description').isLength({min:3,max:200})
  ],isAuth, adminController.postEditProduct);


router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router;
