const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // console.log("Iam in middleware");
  try {
    // console.log("Front in middleware:");
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header
    // console.log("Send data with token in Middleware:", token);
    if (!token) {
      // console.log("Token not found from authMiddleware");
      return res.status(401).json({ message: 'Access denied, token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // console.log("Invalid token from authMiddleware");
        return res.status(403).json({ message: 'Invalid token' });
      }
      // console.log("User data in middleware:",req.user);
      req.user = decoded;
      next();
    });
  } catch (error) {
    // console.error("Error in authenticateToken middleware:", error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};



  const auth = (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Authentication required' });
    }
  };
  
  module.exports = auth;
  
  module.exports = {auth,authenticateToken};