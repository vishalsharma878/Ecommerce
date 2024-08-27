const express = require("express");
const router = express.Router();


const { addToCart, checkout, getCart } = require('../controllers/cartController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const {sendEmail} = require('../controllers/sendEmail')

router.post('/cart', isAuthenticated, addToCart);
router.get('/cart/lists', isAuthenticated, getCart);
router.post('/checkout', isAuthenticated, checkout);
router.get('/send-email', isAuthenticated, sendEmail);

module.exports = router;
