import productModel from "../models/Product.js";


const createProduct = async (req, res) => {
    try {
        let newProduct = req.body;
        let existingProduct = await productModel.findOne({ title: newProduct.title });

        if (existingProduct) {
            return res.status(400).send({
                message: "Product already exists"
            });
        }

        let product = await productModel.create(newProduct);

        res.status(201).send({
            message: 'Product created successfully',
            product: product
        });
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const addRatingAndReview  = async(req,res)=>{
  try {
     const {productId} = req.params
     const {userId,rating,review}= req.body

     //check the user has purchased the product 
     const hasPurchased =await OrderModel.exists({userId,products:{$eleMatch:{productId}}})

    if(!hasPurchased){
       return res.status(400).send({
            message:"you must purchase the product for rating and review"
        })
    }
    const product = await productModel.findById(productId)

    if(!product){
        res.ststus(404).send({message:'product not found'})
    
    }
    else{
         // Add rating and review to the product
         product.ratings.push({userId,rating,review})
         await product.save()
         res.status(200).send({message:"rating and review added sucessfully"})
    }
  } catch (error) {
    console.error('Error adding rating and review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getAllProducts =async(req,res)=>{
    try {
        const Products = await productModel.find()
    if(Products){
        res.status(200).send({
        Products})
    }
    else{
        res.status(404).send({message:"products not found"})

    } 
    } catch (error) {
       console.error( error);
    res.status(500).json({ message: 'Internal server error' });
   
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error('Error getting product by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

    const updateProduct = async (req, res) => {
        try {
            let productId = req.params.id;
            let updatedProduct = req.body;
    
            let product = await productModel.findById(productId);
    
            if (product) {
                await productModel.findByIdAndUpdate(productId, updatedProduct);
                let updatedProductDetails = await productModel.findById(productId);
                res.status(200).send({
                    message: 'Product updated successfully',
                    product: updatedProductDetails
                });
            } else {
                res.status(404).send({
                    message: "Product not found"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    };
    const deleteProduct = async (req, res) => {
        try {
            let productId = req.params.id;
    
            let product = await productModel.findById(productId);
    
            if (!product) {
                 res.status(404).send({
                    message: "Product not found"
                });
            }
            else{
            await productModel.findByIdAndDelete(productId);
    
            res.status(200).send({
                message: 'Product deleted successfully'
            });
            }
        } catch (error) {
            res.status(500).send({
                message: "Internal Server Error",
                error: error.message
            });
        }
    };
    
    const searchProducts = async (req, res) => {
    try {
        const { query, category, sortBy, sortOrder } = req.query;

       // Input validation
if (query && typeof query !== 'string') {
    return res.status(400).send({
        message: "Bad Request",
        error: "Invalid input type for 'query'"
    });
}

if (category && typeof category !== 'string') {
    return res.status(400).send({
        message: "Bad Request",
        error: "Invalid input type for 'category'"
    });
}

if (sortBy && typeof sortBy !== 'string') {
    return res.status(400).send({
        message: "Bad Request",
        error: "Invalid input type for 'sortBy'"
    });
}

if (sortOrder && typeof sortOrder !== 'string') {
    return res.status(400).send({
        message: "Bad Request",
        error: "Invalid input type for 'sortOrder'"
    });
}

        let filter = {};

        if (query) {
            filter.title = { $regex: query, $options: "i" };
        }

        if (category) {
            filter.category = category;
        }

        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Pagination (adjust as needed)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await productModel.find(filter).sort(sort).skip(skip).limit(limit);

        res.status(200).send(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

    
    
    
export default{
    createProduct,
    addRatingAndReview,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    
}