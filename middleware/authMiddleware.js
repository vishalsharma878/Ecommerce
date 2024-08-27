const jwt = require("jsonwebtoken");


exports.isAuthenticated = async (req, res, next) => {
  console.log(req.header)
    const token  = req.header('Authorization');
    if (!token) 
        return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded" ,decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

