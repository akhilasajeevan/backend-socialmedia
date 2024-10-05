// const jwt = require('jsonwebtoken');

// module.exports = function(req, res, next) {
//   const token = req.header('x-auth-token');
//   if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };



// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach user info to request
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// module.exports = authMiddleware;



const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

  console.log("hjgjghg");
  
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log(token);
  
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.log(error.message);
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
