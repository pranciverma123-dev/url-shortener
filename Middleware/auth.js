const { getUser } = require('../services/auth');

function restrictToLoggedInUserOnly(req, res, next) {
    const token = req.cookies?.uid;

    if (!token) {
        return res.status(401).json({
            message: 'Please Login First',
        });
    }

    const user = getUser(token);

    if (!user) {
        return res.status(401).json({
            message: 'Invalid Token',
        });
    }

    req.user = user;

    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
};