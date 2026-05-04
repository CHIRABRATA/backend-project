const express = require("express");
const router = express.Router();

// 1. Import your controllers correctly
// Make sure these names match exactly what is exported in auth.controller.js
const { userRegister, userlogin, userlogout } = require("../controllers/auth.controller");

// 2. Define routes
router.post("/register", userRegister);
router.post("/login", userlogin);
router.post("/logout", userlogout);

module.exports = router;