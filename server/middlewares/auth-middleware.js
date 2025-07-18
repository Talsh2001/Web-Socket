import jwt from "jsonwebtoken";
import { findUser } from "../BLL/userBLL.js";

const JWT_SECRET = "socket";

const getToken = (req) => {
  const tokenHeader = req.headers.authorization;
  if (tokenHeader) {
    const token = tokenHeader.replace("Bearer ", "");
    return token;
  }
  return false;
};

const requireAuth = (req, res, next) => {
  const token = getToken(req);
  if (token) {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.status(403).send("Token invalid!");
      } else {
        const user = await findUser({ username: decodedToken.username });
        res.locals.token = user;
        next();
      }
    });
  } else {
    res.status(401).send("Please Login.");
  }
};

const verifyToken = async (token) => {
  try {
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    const user = await findUser({ username: decodedToken.username });
    return !!user;
  } catch (err) {
    return false;
  }
};

export { requireAuth, getToken, verifyToken };
