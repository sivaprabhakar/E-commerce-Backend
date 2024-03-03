import mongoose from "./index.js";

const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:[true,"First Name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required:[true,"last Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required:[true,"Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Invalid email address'],
    },
    password: {
        type: String,
        required:[true,"Password is required"],
        minlength: 6,
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
    },
    cart: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
        },
    ],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [
        {
            order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            date: { type: Date, default: Date.now },
        },
    ],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    collection: 'users',
    versionKey: false
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
