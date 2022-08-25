const Users = require("../models/Users");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({
        msg: "gagal",
      });
    const user = await Users.findOne({
      refresh_token: refreshToken,
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15s",
        }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ msg: `${error.message}` });
  }
};

module.exports = { refreshToken };
