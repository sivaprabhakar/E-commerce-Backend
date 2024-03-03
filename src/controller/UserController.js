import userModel from "../models/User.js";
import Auth from "../common/auth.js"



//signup users function
const create = async(req,res)=>{
    try {
        const{firstName,lastName,email,password}=req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).send({
              message: "Missing required fields: firstName, lastName, email, password"
            });
          }
        let user = await userModel.findOne({email:req.body.email})
        if(!user){
            req.body.password = await Auth.hashPassword(req.body.password)
            await userModel.create(req.body)
            res.status(201).send({
                message:"user created sucessfully"
            })

        }
        else{
            res.status(400).send({
                message:`user with email ${req.body.email} already exists`
            })
        }
    } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
    }
}
    // login user function
     const logIn = async(req,res)=>{
   
      try {
        
    // Find the user by email
        let user = await userModel.findOne({email:req.body.email})
        if(user)
        {
            let hashCompare = await Auth.hashCompare(req.body.password,user.password)
            if(hashCompare){
                let token = await Auth.createToken({
                    id:user._id,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    email:user.email,
                    role:user.role
                })
                let userData = await userModel.findOne({email:req.body.email},{_id:0,password:0,email:0,firstName:0,lastName:0})
                res.status(200).send({
                    message:'login sucessfull',
                    token,
                    userData
                })
            }
            else
            {
                res.status(400).send({
                    message:`Invalid Password`
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`Account with ${req.body.email} does not exists!`
            })
        }
      } catch (error) {
        res.status(500).send({
            message:"Internal Server Error",
            error:error.message
        })
      }
    
     }

     //get all users function
  const getAllUsers = async(req,res)=>{
    try {
         //get all users from database
     const users = await userModel.find({},{password:0})

     //return the list of all users
     res.status(200).send(users)
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal server error' });
      }
    }
   
    //get users by id function
   const getUserById =async (req,res)=>{
    try {
        const userId = req.params.id
         // Find user by ID in the database
        const user = await userModel.findById(userId,{password:0})
        // Check if user exists
        if(user){
            res.status(200).send(user)
        }
        else{
            res.status(404).send({message:'user not found'})
        }

    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
      
    }
   }
  const userUpdate = async(req,res)=>{
    try {
        let userId = req.params.id
        const userData = req.body

        const updatedUser = await userModel.findByIdAndUpdate(userId,userData,{new:true ,projection: { password: 0 }})
        if (!updatedUser) {
            res.status(404).send({ message: 'User not found' });
          }
          else{
            res.status(200).send({message:"user updated sucessfully", user:updatedUser})
          }
    } catch (error) {
        
    }
  }
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

export default {
    create,
    logIn,
    getAllUsers,
    getUserById,
    userUpdate,
    addToWishlist,
    removeFromWishlist,
    getWishlistItems
}