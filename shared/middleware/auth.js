const jwt = require('jsonwebtoken');
const axios = require('axios');
const logger = require('../utils/logger');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Authorization header must start with Bearer' 
      });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'The provided token is invalid or expired' 
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User must be authenticated' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

const verifyWithAuthService = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Authorization header must start with Bearer' 
      });
    }

    const token = authHeader.substring(7);
    
    // Verify token with Auth Service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.get(`${authServiceUrl}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    req.user = response.data.user;
    next();
  } catch (error) {
    logger.error('Auth service verification failed:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Unable to verify token with auth service' 
    });
  }
};

module.exports = {
  verifyToken,
  requireRole,
  verifyWithAuthService
}; 