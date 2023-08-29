const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    let secret = process.env.secret;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: /\/api\/v1\/products(.*)/, method: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/category(.*)/, method: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/branch(.*)/, method: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/users\/[\w\d]+/, method: ['GET', 'PUT', 'POST', 'OPTIONS'] },
            { url: /\/api\/v1\/orders\/get\/userorders\/[\w\d]+/, method: ['GET', 'PUT', 'POST', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/register',
            '/api/v1/orders',
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
