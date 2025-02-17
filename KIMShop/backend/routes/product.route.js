import express  from 'express';
import { getAllProducts,getFeaturedProducts, createProduct,deleteProduct, getRecommendedProducts, getProductsByCategory,toggleFeaturedProduct} from '../controllers/product.controller.js';
import { protectRoute,adminRoute} from '../middleware/auth.middleware.js';

const router=express.Router();


router.get('/',protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', protectRoute, getProductsByCategory)
router.get('/recommendations',protectRoute, getRecommendedProducts);
router.post('/createProduct', createProduct);
router.patch('/:id',protectRoute,adminRoute, toggleFeaturedProduct);
router.delete('/:id',protectRoute,adminRoute, deleteProduct);


export default router;