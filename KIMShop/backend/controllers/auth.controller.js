import user from "../models/User.model.js";
import { redis } from "../lib/redis.js";
import jwt from 'jsonwebtoken'

const generateTokens= (userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRETE,{expiresIn:"15m",})

    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRETE,{expiresIn:"7d",})

    return {accessToken,refreshToken};
};
const storeRefreshToken= async(userId,refreshToken)=>{
    await redis.set(`refresh_token: ${userId}`,refreshToken,'EX',7*24*60*60);

}

const setCookies=(res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{
         httpOnly:true, //prevent XSS attacks,
         secure:process.env.NODE_ENV==="production",
         sameSite:"strict",// prevent CSRF attack,cross site request forgery attack
         maxAge:15*60*1000,//15 minites  // Corrected unit.  It was 15 mins * 60 secs * 1000 ms

     });

     res.cookie("refreshToken",refreshToken,{
        httpOnly:true, //prevent XSS attacks,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",// prevent CSRF attack,cross site request forgery attack
        maxAge:7*24*60*60*1000,//7 days

    });

}

 export const signup= async(req,res)=>{
    const {email, password ,name }=req.body;

try{
    const UserExists=await user.findOne({email});


    if(UserExists){
        return res.status(400).json({message:"user already exists"});

    }
 const User=await user.create({name,email,password});

 //authenticate user
 const {accessToken,refreshToken}=generateTokens(User._id);
 await storeRefreshToken(User._id,refreshToken);
 setCookies(res,accessToken,refreshToken)



    res.status(201).json({
        _id: User._id,
        name: User.name,
        email: User.email,
        role: User.role,});
}catch(error){
    console.log("Error in signup controller",error.message);
    res.status(500).json({message:error.message});
}
 };

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await user.findOne({ email });

    if (userFound && (await userFound.comparePassword(password))) {  // Corrected:  comparePassword (uppercase 'P')
      const { accessToken, refreshToken } = generateTokens(userFound._id);
      await storeRefreshToken(userFound._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
      });
    } else {
      res.status(401).json({ message: "Invalid Email or password!" });
    }
  } catch (error) {
    console.error("Error in login controller", error);  // Log the full error object
    res.status(500).json({ message: "Login failed" });  // Generic error message
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRETE);
        await redis.del(`refresh_token: ${decode.userId}`);
      } catch (error) {
        console.error("Error verifying or deleting refresh token:", error);
      }
    }
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "logged out successful" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "sever error", error: error.message });
  }
};


//refresh access token

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRETE);
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (!storedToken) {
            return res.status(401).json({ message: "Refresh token expired or not found" });
        }

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRETE, { expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: "Token refreshed successfully", accessToken });

    } catch (error) {
        console.log('Error in refreshToken controller', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getprofile=async(req,res)=>{
 try {
    res.json(req.user);
  
 } catch (error) {

  res.status(500).json({message:"server error",error:error.message}); 

  
 }

}