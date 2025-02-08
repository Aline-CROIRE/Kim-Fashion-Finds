import coupon from "../models/coupon.model.js";


export const getCoupon = async (req, res) => {
    try{
        const coupon= await coupon.findOne({userId:req.user._id,isActive:true});
        res.json(coupon||null);
    }catch{
        console.log("Error in getCoupon controller",error.message);
        res.status(500).json({message:"Server Error",error:error.message}); 
    }

    };




    export const validateCoupon = async (req, res) => {
        try{
            const {code}=req.body;
            const coupon= await coupon.findOne({code:code,userId:req.user._id,isActive:true});
            if(!coupon){
                res.status(404).json({message:"Coupon not found"});
            }
            if(coupon.expirationDate< new date()){
                coupon.isActive=false;
                await coupon.save();
                res.status(400).json({message:"Coupon expired"}); 
            }   
            
            res.json({
                message:"Coupon is valid",
                code:coupon.code,
                discountPercentage:coupon.discountPercentage } 
            )
            
            
        }catch(error){
            console.log("Error in validateCoupon controller",error.message);
          
        }
    };

    export default {getCoupon,validateCoupon};