import express from "express"
import ProductController from "../controller/Product.js"

const router = express.Router()

router.post("/",ProductController.createProduct)
router.get("/",ProductController.getAllProducts)
router.get('/search',ProductController.searchProducts)

router.get('/:id', ProductController.getProductById);
router.put("/:id",ProductController.updateProduct)
router.delete("/:id",ProductController.deleteProduct)

router.post('/:id/ratings-reviews',ProductController.addRatingAndReview)
export default router