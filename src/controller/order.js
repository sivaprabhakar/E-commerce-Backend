import OrderModel from "../models/Order.js";
import productModel from "../models/Product.js";
import userModel from "../models/User.js";
// Create Order
const createOrder = async (req, res) => {
    try {
        const { userId, items, shippingInfo} = req.body;
        
        // Calculate the total price based on the items in the cart
        let totalPrice = 0;
        for (const item of items) {
            const product = await productModel.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }
            totalPrice += product.price * item.quantity;
        }

        // Create the order
        const order = await OrderModel.create({ user: userId, items, totalPrice, shippingInfo });
        await userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } });
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



// Update Order
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { shippingAddress, phone } = req.body;

        const order = await OrderModel.findByIdAndUpdate(orderId, { shippingAddress, phone }, { new: true });

        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        res.status(200).send({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};


// Delete Order
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        res.status(200).send({ message: 'All orders retrieved successfully', orders });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }
        res.status(200).send({ message: 'Order retrieved successfully', order });
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
};

const getUserOrders = async (req,res) => {
    const {userId} = req.params
    try {
      // Find orders with the provided user ID
     
      const userOrders = await OrderModel.find({ user: userId}).populate('items.product');
  
      res.status(200).send(userOrders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default { createOrder, updateOrder, deleteOrder,getOrderById,getAllOrders,getUserOrders};
