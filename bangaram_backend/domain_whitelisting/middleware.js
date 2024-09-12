// domainWhitelistMiddleware.js

const allowedDomains = ['bangaram-project-saikrishna488s-projects.vercel.app', 'bangaram-project.vercel.app','bangaram-project-git-main-saikrishna488s-projects.vercel.app','localhost'];

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
