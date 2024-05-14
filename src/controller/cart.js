import productModel from "../models/Product.js";
import userModel from "../models/User.js";

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        // Check if the product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Check if the product is already in the user's cart
        const user = await userModel.findById(userId);
        if (user.cart.some(item => item.product.toString() === productId)) {
            return res.status(400).send({ message: "Product already in cart" });
        }

        // Add product to user's cart
        user.cart.push({ product: productId, quantity });
        await user.save();
        const { email, cart } = user;
        res.status(200).send({ message: "Product added to cart successfully", email, cart });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (!user.cart || !Array.isArray(user.cart)) {
            return res.status(404).send({ message: 'Cart not found for this user' });
        }
        // Filter out the item with the matching productId
        user.cart = user.cart.filter(item => item.product && item.product.toString() !== productId);
        await user.save();
        const { email, cart } = user; // Extract email and cart details from the user
        res.status(200).send({ message: 'Product removed successfully', email, cart });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const getCartItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId).populate('cart.product');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (!user.cart || !Array.isArray(user.cart)) {
            return res.status(404).send({ message: 'Cart not found for this user' });
        }
        res.status(200).send({ cart: user.cart });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (user.wishlist.includes(productId)) {
            return res.status(400).send({ message: 'Product already in wishlist' });
        }
        user.wishlist.push(productId);
        await user.save();
        res.status(200).send({ message: 'Product added to wishlist successfully', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (!user.wishlist.includes(productId)) {
            return res.status(400).send({ message: 'Product not found in wishlist' });
        }
        user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
        await user.save();
        res.status(200).send({ message: 'Product removed from wishlist successfully', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const getWishlistItems = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId).populate('wishlist');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ wishlist: user.wishlist });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};






export default{
    addToCart,
    removeFromCart,
    getCartItems,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems,
}