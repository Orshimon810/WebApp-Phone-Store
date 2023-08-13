const { expressjwt: jwt } = require("express-jwt")


function authJwt(){
    let secret = process.env.secret;
    return jwt({
        secret,
        algorithms: ['HS256']
    })
}
module.exports = authJwt;