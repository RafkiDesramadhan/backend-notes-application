const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { verifyToken } = require("../middlewares/verifyToken");
const { refreshToken } = require("../middlewares/refreshToken");

// authenticate
router.post("/register", apiController.register);
router.post("/login", apiController.login);
router.delete("/logout", apiController.logout);

// refresh token
router.get("/token", refreshToken);

// notes
router.get("/notes", verifyToken, apiController.getNotes);
router.get("/notes/:id", verifyToken, apiController.getNotesById);
router.post("/notes", verifyToken, apiController.addNotes);
router.delete("/notes/:id", verifyToken, apiController.deleteNotes);
router.put("/notes/:id", verifyToken, apiController.updateNotes);

module.exports = router;
