import { prisma } from "../config/database.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import {sendWelcomeEmail,sendForgotPasswordEmail} from "../utils/forgotPasswordEmail.js"
import crypto from "crypto"

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
        sendWelcomeEmail(email);

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
        return res.status(500).json({message: `Internal server error`})
    }
}

const googleLogin = async(req, res)=>{
    try {
        /* Already have a verification if the token is sent or not within the routes folder
        const { idToken } = req.body;
        if(!idToken){
            return res.status(400).json({message: "There was no token sent"});
        }*/
        const googleUser = req.user;
        const googleId = googleUser.sub;

        let user = await prisma.user.findUnique({
            where: {email: googleUser.email}
        });

        let userStatus = false;
        if(!user){
            user = await prisma.user.create({
                data:{
                    email: googleUser.email,
                    googleId,
                    name: googleUser.name,
                    avatar: googleUser.picture
                }
            });
            userStatus = true;
        }else if(!user.googleId){ 
            //If user email already exists in the app it should add googleId and it would link the user to the account with same email when logging in with google
            user = await prisma.user.update({
                where: {
                    id: user.id
                },
                data:{
                    googleId,
                    name: googleUser.name,
                    avatar: googleUser.picture
                }
            });
        }
        //Deal with adding if no googleID meaning that it is within created account from before just add googleID to join account

        const token = generateToken(user.id);
        return res.status(200).json({
            message: "User was successful with logging in with Google",
            isNewUser: userStatus,
            token
        });
        
    } catch (error) {
        console.error(`Error with using Google to signup/login: ${error}`)
        return res.status(500).json("Internal server error")
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

const forgotPassword = async(req, res) =>{
    //ADD can't reset if already did within 15 minutes
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({message: "Field needs to be filled"});
        }

        const lowerEmail = email.toLowerCase();
        const checkRegEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        if(!checkRegEmail){
            return res.status(400).json({message: "Invalid email"});
        };
        
        const user = await prisma.user.findUnique({
            where:{email: lowerEmail}
        });
        console.log(user);
        if(!user){
            return res.status(200).json({message: "If an account exists, we've sent password reset instructions."});
        }

        //generate a reset passsword token
        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        console.log(typeof hashResetToken);
        //add expire time to be 15 minutes
        const expireAt = new Date(Date.now() + 15 * 60 * 1000);
        console.log(expireAt);
        console.log(typeof user.id);
        //send this to database
        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: hashResetToken,
                expiresAt: expireAt,
            }
        });

        console.log("makes it past sending to db");
        const url = `${process.env.DEEP_LINK_URL}?token=${encodeURIComponent(resetToken)}`
        console.log("makes it past url");
        console.log(url);
        //call sendEmail
        await sendForgotPasswordEmail(user.email, url);
        console.log("makes it past email");
        return res.status(200).json({message: "If an account exists, we've sent password reset instructions."})
                
    }catch(error){
        return res.status(500).json(`Internal Server Error`);
    }
}

const changePassword = async(req,res) =>{
    try{
        const { newPassword, token} = req.body;
        if(!newPassword){
            return req.status(400).json({message: "Nothing was sent for password"});
        }
        if(!token){
            return req.status(400).json({message: "Something went wrong with token"});
        }
        console.log(`Password in backend: ${newPassword} and token is ${token}`);

        const hashGivenToken = crypto.createHash("sha256").update(token).digest("hex");
        console.log(`hashedToken: ${hashGivenToken}`);
        const findToken = await prisma.passwordResetToken.findUnique({
            where: {token: hashGivenToken}
        })
        console.log(`Token in database: ${findToken}`);
        if(!findToken){
            return res.status(400).json({message: "No token was found"});
        }
        const findUser = await prisma.user.findUnique({
            where:{id: findToken.userId}
        })

        if(!findUser){
            return res.status(400).json({message: "No user found."});//shouldn't really get to this point up to now. But just in case
        }
        const isPasswordValid = await bcrypt.compare(newPassword, findUser.password);
        if(isPasswordValid){
            return res.status(400).json({message: "Password must be different than present password"});
        }

        if(findToken.expiresAt < Date.now()){
            return res.status(400).json({message: "Time has expired"});
        }
        const checkRegPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/.test(newPassword);
        if(!checkRegPassword){
            return res.status(400).json({message: "Password needs to be 8 characters long. Must contain a uppercase, lowercase, unique character (@$!%*&#), and a digit."})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const user = await prisma.user.update({
            where:{id:findToken.userId},
            data: {password:hashedPassword}
        });
        console.log(`user updated password: ${user}`);
        return res.status(200).json({message: "Successfully changed password!"});
    }catch(error){
        return res.status(500).json({message: "Internal Server Error"});
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
    registerUser, loginUser, logoutUser, googleLogin, forgotPassword, changePassword
};