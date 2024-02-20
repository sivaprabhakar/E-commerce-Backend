import express from "express"
import UserRoute from './UserRoute.js'
import ProductRoute from './ProductRoute.js'
import cartRoute from './cartRoute.js'
import orderRoute from './orderRoute.js'
const router = express.Router()

router.use('/user',UserRoute)
router.use('/product',ProductRoute)
router.use('/cart',cartRoute)
router.use('/order',orderRoute)
export default router