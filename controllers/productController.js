const Product = require('../models/Product');

function bufferToDataUrl(buffer, mimeType) {
  const base64String = buffer.toString('base64');
  return `data:${mimeType};base64,${base64String}`;
}

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const buffer = req.file.buffer; // Get your file buffer
    const mimeType = req.file.mimetype; // Specify the correct MIME type
    const dataUrl = bufferToDataUrl(buffer, mimeType);

    const imageUrl = dataUrl;

    const product = new Product({
      title,
      description,
      price,
      imageUrl,
    });

    await product.save();
    
    res.status(201).json({ success: true, message: 'Product created', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};
