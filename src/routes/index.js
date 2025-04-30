const { Router } = require('express')
const {
  registerValidation,authJwt
} = require("shared-utils");
const {registerUser,loginUser,logOutUser, logoutUser}=require("../controllers/user-controller.js")
const router = Router()

router.route("/signUp").post(registerValidation, registerUser);
router.route("/signIn").post(loginUser);
router.route("/signOut").post(authJwt,logoutUser);

module.exports = router