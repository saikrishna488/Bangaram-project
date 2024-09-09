// domainWhitelistMiddleware.js

const allowedDomains = ['localhost', '127.0.0.1'];

function domainWhitelistMiddleware(req, res, next) {
    const origin = req.headers.origin;

    // Check if the origin is in the allowed domains list
    if (origin && allowedDomains.includes(new URL(origin).hostname)) {
        next(); // Domain is allowed, proceed to the next middleware
    } else {
        res.status(403).json({ msg:false, message: 'Forbidden: Your domain is not allowed' });
    }
}

export default domainWhitelistMiddleware;
