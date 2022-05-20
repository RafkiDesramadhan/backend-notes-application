const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../models/Users");
const Notes = require("../models/Notes");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, password, confPassword } = req.body;
      if (
        username === "" ||
        password === "" ||
        username === null ||
        password === null
      ) {
        return res
          .status(404)
          .json({ status: "fail", msg: "Username or password not found!" });
      }
      if (password !== confPassword) {
        return res.status(400).json({
          status: "fail",
          msg: "Password and confirm password must be the same!",
        });
      }

      const users = await Users.find();
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
          return res.status(400).json({ msg: "Username already exists!" });
        }
      }

      await Users.create({
        username,
        password,
      });
      res.status(201).json({
        status: "success",
        msg: "User success created!",
      });
    } catch (error) {
      res.status(500).json({ msg: `${error.message}` });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username });
      if (!user) {
        return res.status(404).json({ msg: "User not found!" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ status: "fail", msg: "Wrong password!" });

      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "20s",
        }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      await Users.updateOne(
        { _id: user.id },
        {
          $set: {
            refresh_token: refreshToken,
          },
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ status: "success", accessToken });
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);
      if (!refreshToken) return res.sendStatus(204);

      const user = await Users.findOne({ refresh_token: refreshToken });
      if (!user) res.sendStatus(204);

      const id = user._id;
      await Users.updateOne(
        { _id: id },
        {
          $set: {
            refresh_token: null,
          },
        }
      );

      res.clearCookie("refreshToken");
      return res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
  getNotes: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const user = await Users.findOne({
        refresh_token: refreshToken,
      });
      const notes = await Notes.find({
        userId: user._id,
      });
      res.status(200).json({ status: "success", notes });
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
  getNotesById: async (req, res) => {
    try {
      const { id } = req.params;
      const notes = await Notes.findOne({
        _id: id,
      });
      res.status(200).json({ status: "success", notes });
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
  addNotes: async (req, res) => {
    try {
      const { note, date } = req.body;
      if (!note)
        return res.status(404).json({ status: "fail", msg: "Notes empty!" });

      const refreshToken = req.cookies.refreshToken;
      const user = await Users.findOne({
        refresh_token: refreshToken,
      });
      const id = user._id;
      await Notes.create({
        notes: note,
        userId: id,
        date,
      });
      res.status(201).json({ status: "success", msg: "Success insert notes!" });
    } catch (error) {
      res.status(500).json({ msg: `${error.message}` });
    }
  },
  deleteNotes: async (req, res) => {
    try {
      const { id } = req.params;
      await Notes.deleteOne({ _id: id });
      res.status(200).json({ status: "success", msg: "Success delete notes!" });
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
  updateNotes: async (req, res) => {
    try {
      const { id } = req.params;
      const { note, date } = req.body;

      if (!note)
        return res.status(404).json({ status: "fail", msg: "Note not found!" });

      await Notes.updateOne(
        { _id: id },
        {
          $set: {
            notes: note,
            date,
          },
        }
      );
      res.status(200).json({ status: "success", msg: "Success update notes!" });
    } catch (error) {
      res.status(500).json({ status: "fail", msg: `${error.message}` });
    }
  },
};
