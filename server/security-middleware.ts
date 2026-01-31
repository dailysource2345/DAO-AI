
// Security middleware for production deployment
import { Request, Response, NextFunction } from 'express';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

export const rateLimiter = (windowMs: number, maxRequests: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    const clientRequests = rateLimitStore.get(clientIP) || [];
    const validRequests = clientRequests.filter((timestamp: number) => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validRequests.push(now);
    rateLimitStore.set(clientIP, validRequests);
    next();
  };
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove potential XSS and SQL injection patterns
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  next();
};

export const validateContentType = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('Content-Type');
    if (!contentType || (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded'))) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
  }
  next();
};

// Detect suspicious patterns
export const securityMonitor = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /<script/i,
    /eval\s*\(/i,
    /document\.cookie/i
  ];

  const requestString = JSON.stringify({ 
    url: req.url, 
    query: req.query, 
    body: req.body 
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestString));
  
  if (isSuspicious) {
    console.warn(`Suspicious request detected from ${req.ip}: ${req.method} ${req.url}`);
    // Log to file or external service in production
  }
  
  next();
};
