import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


const hashPassword = async(password)=>{
    let salts = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS))
    let hash = await bcrypt.hash(password,salts)
    return hash
}
 
const hashCompare =async(password,hash)=>{
    return await bcrypt.compare(password,hash)  
    
}
const createToken =(payload)=>{
        const token = jwt.sign(payload,process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRE})
            return token
}
const decodeToken = (token) => {
    return jwt.decode(token);
  };

  const validate = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ message: "No token found" });
      }
  try {
    const payload = decodeToken(token)
    req.userId =payload.id
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }    
  }

export default{
    hashPassword,
    hashCompare,
    createToken,
    decodeToken,
    validate
    
}