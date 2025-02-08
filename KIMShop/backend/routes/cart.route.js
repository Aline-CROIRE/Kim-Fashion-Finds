import express from 'express';
import {addToCart} from '../controllers/cart.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';
import {removeAllFromCart} from '../controllers/cart.controller.js';
import {getCartProducts} from '../controllers/cart.controller.js';
import {updateQuantity} from '../controllers/cart.controller.js';


const router=express.Router();
router.get('/',protectRoute,getCartProducts);
router.post('/',protectRoute,addToCart);
router.delete('/',protectRoute,removeAllFromCart);
router.put('/:id',protectRoute,updateQuantity);
export default router;