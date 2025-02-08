
import Coupon from "../models/coupon.model.js";
import {stripe} from "../lib/stripe.js";
import  Order from '../models/order.model.js'


export const createCheckoutSession = async(req,res)=>{

    try{
        const {products,couponCode}=req.body;

        if(!Array.isArray(products) || products.length===0){
            return res.status(400).json({message:"No products provided"});
        }

        let totalAmount=0;

        const lineItems=products.map((product)=>{
            const amount=Math.round(product.price*100);// stripe want to send in the formant of cents
            totalAmount+=amount*product.quantity;   
         
            return{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount 
                              },
                            }

        });


        let coupon=null;
        if(couponCode){
            coupon=await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true});
        if(coupon){
            totalAmount-=Math.round(totalAmount*(coupon.discountPercentage/100));
        }
         const  session=await stripe.checkout.sessions.create({
            payment_method_types: ["card","mobile_pay"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-session?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
            ?[
                {
                    coupon: await createCheckoutSession(coupon.discountPercentage),
                }
            ]
            :[],
            customer_email: req.user.email,
            metadata:{
                userId:req.user_id.toString(),
                couponCode:couponCode||"",
                products:JSON.stringify(
                    products.map((p)=>({
                        id:p_id,
                        quantity:p.quantity,
                        price:p.price,
                    }))
                ),

            }

        });

        if(totalAmount>=20000)
{
     await createNewCoupon(req.user._id);
}

res.status(200).json({id:session.id,totalAmount:totalAmount/100});

     
        
        }
        
    }catch(error){
        console.log("Error in create checkout session controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }


}
    

export const  checkoutSuccess=async(req,res)=>{

     
    try {
    
        const {sessionId}=req.body;
        const session= await stripe.checkout.sessions.retrieve(sessionId);
    
        if(session.payment_status==='paid'){
            if(session.metadata.couponCode){
                await couponCode.metadata.findOneAndUpdate({
                    code:startSession.metadata.couponCode,userId:session.metadata.userId
    
                },
                {
                    isActive:false
                }
            
            )
            }
            //create an order
            const products=JSON.parse(session.metadata.products);
            const newOrder=new Order(
                {
                    user:session.metadata.userId,
                    products: products.map(product=>({
                        product:product.id,
                        quantity:product.quantity,
                        pricre:product.pricre
                    })),
                    totalAmount: session.amount_total/100, //converts from cents to dollars
                    stripeSessionId:sessionId
                }
            )
    
    await newOrder.save();
    res.status(200).json({
        success:true,
        message:"Payment is uccessful, order creates, and coupon deactivated if used.",
        order_id:newOrder._id,
    });
    
        }
        
    } catch (error) {
    
        res.status(500).json({message:"Eroor processing payments", error:error.message});
        
    }
    
        
    }


async function createStripeCoupon(discountPercentage){
    const coupon= await stripe.coupons.create({
        percent_off:discountPercentage,
        durattion:"once",
    })
    return coupon.id;
}
async function createNewCoupon(userId) {
const newCoupon=newCoupon({
    code:"GIFT"+Math.random().toString(36).substring(2,8).toUpperCase(),
    discountPercentage:10,
    expirationDate:new Date(Date.now()+ 30*24*60*60*1000), // 30 days from now
    userId:userId

} )
await newCoupon.save();
return newCoupon;


}




        