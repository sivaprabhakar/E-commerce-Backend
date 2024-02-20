import express  from "express";
import UserController from "../controller/UserController.js"
import Auth from "../common/auth.js"
const router = express.Router()


router.post('/signup',UserController.create)
router.post('/login',UserController.logIn)
router.get("/",UserController.getAllUsers)
router.get("/:id",Auth.validate,UserController.getUserById)
router.put("/:id",Auth.validate,UserController.userUpdate)
router.post('/wishlist',Auth.validate,UserController.addToWishlist)
router.delete('/wishlist',Auth.validate,UserController.removeFromWishlist)
router.get('/wishlist/:userId',Auth.validate,UserController.getWishlistItems);

export default router;