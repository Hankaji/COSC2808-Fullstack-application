"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware or route handler
        return next();
    }
    else {
        // User is not authenticated, return an error response
        return res
            .status(401)
            .json({ message: 'Unauthorized: Please log in to access this resource' });
    }
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        // User is an admin, proceed to the next middleware or route handler
        return next();
    }
    else {
        // User is not an admin, return an error response
        return res
            .status(403)
            .json({ message: 'Forbidden: Only Admins can access this resource' });
    }
};
exports.isAdmin = isAdmin;
