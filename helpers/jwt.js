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
            '/api/v1/users/login',
            '/api/v1/users/register',
        ]
    });
}

async function isRevoked(req, token) {
   
    if(!token.payload.isAdmin) {
        return true
    }
     return undefined;
}



module.exports = authJwt;
