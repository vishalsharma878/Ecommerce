const express = require("express");
const productRouter = express.Router();
const multer = require('multer');
const {createProduct, getAllProducts} = require("../controllers/productController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


productRouter.post("/product",  upload.single('image'), createProduct)
productRouter.get("/product", getAllProducts);


module.exports = productRouter;