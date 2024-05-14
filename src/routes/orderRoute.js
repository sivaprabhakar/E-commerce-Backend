import express from "express"
import OrderController from '../controller/order.js'
import Auth from "../common/auth.js"
const router = express.Router()


router.post('/neworder',Auth.validate,OrderController.createOrder)
router.put('/:orderId',Auth.validate,OrderController.updateOrder)
router.delete('/:orderId',Auth.validate,OrderController.deleteOrder)
router.get('/',OrderController.getAllOrders)
router.get('/:orderId',Auth.validate,OrderController.getOrderById)
router.get('/myorder/:userId',Auth.validate,OrderController.getUserOrders)

export default router