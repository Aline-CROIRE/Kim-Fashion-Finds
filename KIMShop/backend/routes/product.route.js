import express  from 'express';
import { getAllProducts,getFeaturedProducts, createProduct,deleteProduct, getRecommendedProducts, getProductsByCategory,toggleFeaturedProducts} from '../controllers/product.controller.js';
import { protectRoute,adminRoute} from '../middleware/auth.middleware.js';

const router=express.Router();


router.get('/',protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', protectRoute, getProductsByCategory)
router.get('/reccommendations',protectRoute, getRecommendedProducts);
router.post('/',protectRoute,adminRoute, createProduct);
router.patch('/:id',protectRoute,adminRoute, toggleFeaturedProducts);
router.delete('/:id',protectRoute,adminRoute, deleteProduct);


export default router;