import { prisma } from "../config/database.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"

const registerUser = async(req, res) =>{
    //for now hash password so we are not direcly putting passwords in database but once
    //models/schemas are created see if adding hashing there is faster or easier.
    try{
        const { username, email, password, confirmPassword } = req.body;
        if(!username || !email || !password || !confirmPassword){
            return res.status(400).json({ message: "All fields needs to be filled." })
        }
        
        const lowerEmail = email.toLowerCase();

        const existingEmail = await prisma.user.findUnique({
            where: {email: lowerEmail},
        });

        if(existingEmail){
            return res.status(400).json({ message: "User already exists" });
        }

        const existingUsername = await prisma.user.findUnique({
            where: {username: username},
        });
        if(existingUsername){
            return res.status(400).json({ message: "This username is already being used. Please try another username."});
        }

        const checkRegUsername = /^[a-z][a-z0-9._]{2,}$/.test(username);
        if(!checkRegUsername){
            return res.status(400).json({message: "Username must be 3 characters long. Lowercase letters."})
        }

        const checkRegEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        if(!checkRegEmail){
            return res.status(400).json({message: "Invalid email"});
        }

        const checkRegPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/.test(password);
        if(!checkRegPassword){
            return res.status(400).json({message: "Password needs to be 8 characters long. Must contain a uppercase, lowercase, unique character (@$!%*&#), and a digit."})
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Password and ConfirmPassword don't match"});
        }

        //hash pass
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        

        //create user
        const user = await prisma.user.create({
            data:{
                username,
                email: lowerEmail,
                password: hashedPassword
            }
        });

        //generate JWT token
        const token = generateToken(user.id);

        return res.status(201).json({
            message: "User was successfully registered!",
            data: {
                user:{ 
                    username: user.username, 
                    email: user.email
                } 
            },
            token
        })
        
    }catch(error){
        console.error(`Error in registering user: ${error}`);
        return res.status(400).json({message: `Internal server error`})
    }
}

const loginUser = async(req, res)=>{
    try{
        const{ email, password } = req.body;
        if( !email || !password ){
            return res.status(400).json({message: "All fields needs to be filled."});
        }

        const lowerEmail = email.toLowerCase();

        const userExist = await prisma.user.findUnique({
            where: {email: lowerEmail}
        });

        if(!userExist){
            return res.status(400).json({message: "Email or password is incorrect"});
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Email or password is incorrect"})
        }

        //JWT
        const token = generateToken(userExist.id);

        return res.status(200).json({
            message: "User successfully logged in!",
            data: {
                user:{
                    email: userExist.email
                }
            },
            token
        })


    }catch(error){
        console.error(`Error logging in user: ${error}`);
        return res.status(500).json(`Internal Server Error`);
    }
}

const logoutUser = async(req,res)=>{
    try{
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: {email: email}
        })
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        return res.status(200).json({message:"logout successful"});
    }catch(error){
        console.error(`Error logging user out: ${error}`)
        return res.status(500).json({message:`Internal Server Error:`})
    }
}
export{
    registerUser, loginUser, logoutUser
};