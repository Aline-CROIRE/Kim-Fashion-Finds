import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },

    price:{
        type:String,
        min:0,
        require:true
    },
    image:{
        type:String,
        required:[true, 'image is required']

    },

    isFeatures:{
        type:Boolean,
        default:false
    }
}, {timestamps:true});


const product=mongoose.model("product",productSchema);

export default product;