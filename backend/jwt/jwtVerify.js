import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']; // Directly retrieve the token

  if (!token) {
    return res.status(401).json({ msg: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data to request object
    req.verified = true
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({msg :false, message: 'Invalid or expired token' });
  }
}

export default verifyToken;
