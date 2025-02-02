var admin = require("firebase-admin");
var { StatusCodes } = require("http-status-codes");
require('dotenv').config();

let serviceAccount;
if (process.env.SERVICE_ACCOUNT_KEY_PATH) {
  try {
    serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY_PATH);
  } catch (error) {
    console.error('Error parsing FIREBASE_CONFIG:', error);
    throw error;
  }
} else {
  throw new Error('FIREBASE_CONFIG environment variable is not set');
}



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
