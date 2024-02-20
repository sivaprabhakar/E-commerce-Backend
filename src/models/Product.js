import mongoose from './index.js'


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      category: {
        type: String,
        required: true,
        trim: true,
      },
      stockQuantity: {
        type: Number,
        required: true,
        min: 0,
      },
      imageUrl: {
        type: [String],
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, required: true, min: 1, max: 5 },
            review:{type:String},
            date: { type: Date, default: Date.now }
        }
    ]  
}, 
  {  collection:'Product',
     versionKey:false
})

const productModel = mongoose.model('Product',productSchema)
export default productModel