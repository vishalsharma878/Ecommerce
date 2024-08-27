
const Cart = require("../models/cart");

exports.addToCart = async (req, res) => {
   try {
      const { productId, quantity } = req.body;
      const user = req.user.id;

      let cart = await Cart.findOne({ user: user }).populate({
         path: 'items.product',
         select: 'title price imageUrl description'
      });

      if (!cart) {
         cart = new Cart({ user, items: [] });
      }

      const item = cart.items.find(item => item.product.equals(productId));
      if (cart && item) {
         await Cart.updateOne(
            { user: user, 'items.product': productId },
            { $set: { 'items.$.quantity': quantity + item.quantity } }
         );
      } else {
         cart.items.push({ product: productId, quantity: quantity });
         await cart.save();
      }

      res.status(200).json({ success: true, message: "Product successfully added to the Cart", cart });
   } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ success: false, message: 'Failed to add product to cart' });
   }
};

exports.checkout = async (req, res) => {
   try {
      const address = req.body.address;
      const cart = await Cart.findOne({ user: req.user.id });

      if (!cart) {
         return res.status(400).json({ success: false, message: 'Cart not found' });
      }

      cart.shippingAddress = address;
      await cart.save();

      cart.items = [];
      await cart.save();

      res.status(200).json({ success: true, message: 'Checkout successfully completed and cart cleared' });
   } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ success: false, message: 'Failed to checkout' });
   }
};

exports.getCart = async (req, res) => {
   try {
      const userId = req.user.id;

      let cart = await Cart.findOne({ user: userId }).populate({
         path: 'items.product',
         select: 'title price description imageUrl'
      });

      if (!cart) {
         return res.status(404).json({ success: false, message: 'Cart not found' });
      }

      res.status(200).json({ success: true, cart });
   } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ success: false, message: 'Server error' });
   }
};
