
import product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js'


export const getAllProducts=async(req,res)=>{
    try{
        const products= await product.find({});
        res.json({products});
    }catch(error){
        console.log("errror in getAllproducts controlller",error.message);
        res.status(500).json({messsage:"Server error",error:error.message});
    }
};


export const getFeaturedProducts = async(req,res)=>{
    try{

     let featuredProducts=await redis.get("featured_products")

     if(featuredProducts){
        return res.json(JSON.parse(featuredProducts));
     }

     // if not in redis ,fetch it from mongodb
     // .lean return a plain js object instead of mongodb document 

     featuredProducts=await product.find({isFeatures:true}).lean();
   
     //for feture quick access store it in redis

     await  redis.set("feautured_products",JSON.stringify(featuredProducts));

     res.json(featuredProducts);


    }catch(error){

        console.log('Error in getFeaturedProducts controller',error.message);
        res.status(500).json({message:'Server Error',error:error.message});

    }
};


export const createProduct= async(req,res)=>{


    try{
       const {name,description,price,image,category}=req.body;
       let cloudinaryResponse=null
       
       if(image){
        await cloudinary.uploader.upload(image,{folder:"products"})
       }

       const product= await product.create({
        name,
        description,
        price,
        image:cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url:"",
        category,
       });
       res.status(201).json(product);
    }catch(error){

        console.log("error in createProduct controller",error.message);
        res.status(500).json({message:"Server error",error:error.message})

    }
}


export const deleteProduct =async(req,res)=>{
    try{
        const product = await product.findByid(req.params.id);

        if(!product){
            return res.status(404).json({message:"product not found"});
        }
         
        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0]; // get id of product
            try{
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary")
            }catch{
                console.log("error deleting image from  cloudinary")
            }
        }

          await product.findByidAndDelete(req.params.id)
          res.json({message:"Product deleted successfully"})

    }catch(error){
        console.log("Error in create product controller");
        res.status(500).json({message:"Sever error",error:error.message})
    }
}


export const  getRecommendedProducts=async(req,res)=>{
    try {
        const products = await product.aggregate([
            {
            $sample:{size:4}
        },
        {
            $project:{
                _id:1,
                name:1,
                description:1,
                image:1,
                price:1
            }
        }
])
res.json(products)

    } catch (error) {
        console.log("Error in getReccommendedProducts controller",error.message);
        res.status(500).json({message:"server error",error:error.message});
        
    }
}


export const getProductsByCategory=async(res,req)=>{
    const category= req.params;
    try {
       const product= await product.find({category});
       res.json(products)

    } catch (error) {
        console.log("error in getproductbycategory controller")
        res.status(500).json({messsage:"sever error",error:error.message})
        
    }
}

export const toggleFeaturedProducts=async(res,req)=>{
    try {
        const product= await product.findByid(req.params.id);
        if(product){
            product.isFeatures=!product.isFeatured;

            const updatedProduct= await product.save();
            //update redis

            await updateFeaturedProductsCache();
            res.json(updatedProduct);

        }else{
            res.status(404).json({message:"Nothing found"});
        }

    } catch (error) {
        console.log("Error in toggleFeaturedProducts controller");
        res.status(500).json({message:"Server Error",error:error.message});
        
    }
}


async function updateFeaturedProductsCache(){
    try {
        const featuredProduct=await product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProduct));
    } catch (error) {
        console.log("Error in upade featured product cache function");
    }
}