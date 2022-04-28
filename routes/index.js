const router = require("express").Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");

// login
router.get("/login", adminController.viewLogin);
router.post("/login", adminController.actionLogin);
router.use(auth);
router.get("/logout", adminController.actionLogout);

// routes dashboard
router.get("/dashboard", adminController.viewDashboard);

// routes users
router.get("/users", adminController.viewUsers);
router.post("/users", adminController.addUsers);
router.delete("/users/:id", adminController.deleteUsers);
router.put("/users", adminController.editUsers);

// routes notes
router.get("/notes", adminController.viewNotes);
router.post("/notes", adminController.addNotes);
router.delete("/notes/:id", adminController.deleteNotes);
router.put("/notes", adminController.editNotes);

module.exports = router;
