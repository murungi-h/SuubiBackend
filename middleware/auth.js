var admin = require("firebase-admin");
var { StatusCodes } = require("http-status-codes");
require('dotenv').config();

var serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function AuthMiddleware(req, res, next) {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "No token provided" });
  }

  if (headerToken.split(" ")[0] !== "Bearer") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "Invalid token header" });
  }

  const idToken = headerToken.split(" ")[1];

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Could not verify token" });
    });
}

module.exports = AuthMiddleware;
