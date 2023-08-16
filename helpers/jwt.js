const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    let secret = process.env.secret;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, method: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/category(.*)/, method: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/category(.*)/, method: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/register',
        ]
    });
}

async function isRevoked(req, token) {
    if (!token.payload.isAdmin) {
        // Revoke tokens for non-admin users
        return true;
    }
    // Allow tokens for admin users
    return undefined;
}


module.exports = authJwt;
