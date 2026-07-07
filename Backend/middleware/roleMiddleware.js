const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if the protect middleware successfully attached the user profile
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Missing account role profiles.' 
      });
    }

    // Check if the user's role matches any of the allowed roles passed to the middleware
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: This action is restricted to [${allowedRoles.join(', ')}]. Current role: '${req.user.role}'` 
      });
    }
    
    next();
  };
};

module.exports = { authorizeRoles };