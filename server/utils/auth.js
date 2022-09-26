const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.secret;
const expiration = "2h";

module.exports = {
    // expects a user object, adds user's properties to token
    // optional: exp, and secret (has nothing to do with encoding)
    // A TOKEN IS NOT PART OF THE USER MODEL
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
    authMiddleware: function ({ req }) {
        // allows tokens to be sent via req.body, req.query, or headers
        let token =
            req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            // if the secret ^ doesn't match the secret that was used with jwt.sign(), then object won't be decoded
            req.user = data;
        } catch {
            console.log("Invalid token!");
        }

        // return updated request object
        return req;
    },
};
