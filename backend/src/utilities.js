import jwt from "jsonwebtoken";

export const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json("Token is invalid.");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json("Request is invalid.");
    req.user = user;
    next();
  });
}; // For the authentication through the cookies or token for validation of user.
