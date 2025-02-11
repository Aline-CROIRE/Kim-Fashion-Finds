import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getprofile } from "../controllers/auth.controller.js";

 import {login,logout,signup,refreshToken} from "../controllers/auth.controller.js"
const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.get("/refresh-token",refreshToken);
 router.get("/profile",getprofile);





export default router;

