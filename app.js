const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json());

app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);

const startServer = async () => {
    try {
      await mongoose.connect(process.env.MONGO_CLIENT);
      console.log("Connected to MongoDB");
  
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } catch (err) {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1);  
    }
  };
  
  startServer();