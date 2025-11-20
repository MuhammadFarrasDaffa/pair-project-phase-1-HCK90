const express = require('express');
const CartController = require('../controllers/cartController');

const router = express.Router();

router.post('/add-to-cart', CartController.addToCart);

router.get('/cart', CartController.viewCart);

router.post('/cart/update', CartController.updateQty);

router.get('/cart/remove/:productId', CartController.removeItem);

router.post('/cart/checkout', CartController.checkout);

module.exports = router;
