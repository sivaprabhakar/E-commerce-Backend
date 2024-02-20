import express from 'express'
import cartController from '../controller/cart.js'
import Auth from "../common/auth.js"

const router = express.Router()

router.post('/add',Auth.validate,cartController.addToCart)

router.delete('/',Auth.validate,cartController.removeFromCart)
router.get('/:userId',Auth.validate,cartController.getCartItems)

export default router;