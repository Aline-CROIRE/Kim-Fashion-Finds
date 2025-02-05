import express from "express";

 import {login,logout,signup,refreshToken} from "../controllers/auth.controller.js"
const router=express.Router();

router.post("/signup",signup);
router.get("/login",login);
router.get("/logout",logout);
router.get("/refresh-token",refreshToken);
// router.get("/profile",getprofile);





export default router;