
import Product from '../models/product.model.js';




export const getCartItems=async(req,res)=>{
    try{
    const products=await Product.find({_id:{$in:req.user.cartItems}});    
//add quantity for each product

const cartItems=products.map(product=>{
    const item=req.user.cartItems.find(cartItem=>cartItem.id===product.id);
    return {...product.toJSON(),quantity:item.quantity};
})
res.json(cartItems);

    }catch(error){
        console.log("Error in getCartItems controller",error.message);
        res.status(500).json({message:"Server Error",error:error.message});
    }



export const addToCart=async(req,res)=>{
    try {
        const {productId}=req.body;
        const user=req.body;
        const existingItem=user.cartItems.find(item=>item.product==productId);
        if(existingItem){
            existingItem.quantity+1;
        }else{
            user.cartItems.push({product:productId,quantity:1});
        }
        await user.save();
        res.json(user.cartItems);
        
    } catch (error) {
        console.log("Error in addToCart controller",error.message);
        res.status(500).json({message:"Server Error",error:error.message});
    }
}

export const removeAllFromCart=async(req,res)=>{
    try {
        const {productId}=req.body;
             const user=req.user;

if(!productId){
    user.cartItems=[];
}else{
    user.cartItems=user.cartItems.filter(item=>item.product!==productId);
}
 await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart controller",error.message);
        res.status(500).json({message:"Server Error",error:error.message});
    }
}

export const updateQuantiy=async(req,res)=>{
    try{
        const{id:ProductId}=req.params;
        const {quantity}=req.body;
        const user=req.user;
        const existingItem=user.cartItems.find((item)=>item.id=ProductId);
        if(existingItem){
            if(quantity===0){
               
                user.cartItems=user.cartItems.filter((item)=>item.id!==ProductId)
                await user.save();
                res.json(user.cartItems);
            }

            existingItem.quantity=quantity;
            await user.save();
            res.json(user.cartItems);

        } else{
            res.status(404).json({message:"product not found"});

        }


    }catch(error){
        console.log("Error in updateQuantiy controller",error.message);
        res.status(500).json({message:"Server Error",error:error.message});
    }
}   

