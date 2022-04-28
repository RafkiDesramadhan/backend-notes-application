const bcrypt = require("bcrypt");
const Users = require("../models/Users");
const Notes = require("../models/Notes");

module.exports = {
  viewLogin: (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render("index", {
        title: "Notes App | Login ",
        alert,
      });
    } catch (error) {
      console.log(error);
    }
  },
  actionLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.find();
      if (!user) {
        req.flash("alertMessage", "User not found!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }
      const match = await bcrypt.compare(password, user[0].password);
      if (!match) {
        req.flash("alertMessage", "Wrong password!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/login");
      }

      req.session.user = {
        id: user[0]._id,
        username,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/login");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
  },
  viewDashboard: async (req, res) => {
    try {
      const users = await Users.find();
      const notes = await Notes.find();

      res.render("admin/dashboard/view_dashboard", {
        title: "Notes App | Dashboard",
        users,
        notes,
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },
  viewUsers: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const users = await Users.find();

      res.render("admin/users/view_users", {
        title: "Notes App | Users",
        alert,
        users,
        user: req.session.user,
      });
    } catch (error) {}
  },
  addUsers: async (req, res) => {
    try {
      const { username, password, confPassword } = req.body;
      // validation
      if (password !== confPassword) {
        req.flash(
          "alertMessage",
          "Sorry password and confirm password must be the same!"
        );
        req.flash("alertStatus", "danger");
        res.redirect("/admin/users");
        return false;
      }

      await Users.create({ username, password });
      req.flash("alertMessage", "Success Add User");
      req.flash("alertStatus", "success");
      res.redirect("/admin/users");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/users");
    }
  },
  deleteUsers: async (req, res) => {
    try {
      const { id } = req.params;
      await Users.deleteOne({ _id: id });
      req.flash("alertMessage", "Success Delete User");
      req.flash("alertStatus", "success");
      res.redirect("/admin/users");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/users");
    }
  },
  editUsers: async (req, res) => {
    try {
      const { id, oldPassword, newPassword, confPassword } = req.body;
      const user = await Users.findOne({ _id: id });

      if (!user) {
        req.flash("alertMessage", "User not found!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/users");
        return false;
      }

      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        req.flash("alertMessage", "Wrong password!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/users");
        return false;
      }

      if (newPassword !== confPassword) {
        req.flash(
          "alertMessage",
          "password and confirm password must be the same"
        );
        req.flash("alertStatus", "danger");
        res.redirect("/admin/users");
        return false;
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(newPassword, salt);
      await Users.updateOne({
        _id: id,
        $set: {
          password: hashPassword,
        },
      });

      req.flash("alertMessage", `Success edit password!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/users");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/users");
    }
  },
  viewNotes: async (req, res) => {
    try {
      const users = await Users.find();
      const notes = await Notes.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };

      res.render("admin/notes/view_notes", {
        title: "Notes App | Notes",
        notes,
        users,
        alert,
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/notes");
    }
  },
  addNotes: async (req, res) => {
    try {
      const { notes, userId } = req.body;
      await Notes.create({
        notes,
        userId,
      });
      req.flash("alertMessage", `Success add notes!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/notes");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/notes");
    }
  },
  deleteNotes: async (req, res) => {
    try {
      const { id } = req.params;
      await Notes.deleteOne({ _id: id });
      req.flash("alertMessage", `Success add notes!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/notes");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/notes");
    }
  },
  editNotes: async (req, res) => {
    try {
      const { id, userId, notes } = req.body;
      const notesDB = await Notes.findOne({ _id: id });
      notesDB.userId = userId;
      notesDB.notes = notes;
      await notesDB.save();
      req.flash("alertMessage", `Success edit notes!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/notes");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/notes");
    }
  },
};
