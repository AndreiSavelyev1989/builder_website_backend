const jwt = require("jsonwebtoken");

module.exports = {
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null)
      return res.status(401).send({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send({ message: "Invalid token" });

      req.user = user;
      next();
    });
  },
};
