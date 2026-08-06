import { prisma } from "../config/database.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import {sendWelcomeEmail,sendForgotPasswordEmail} from "../utils/forgotPasswordEmail.js"
import crypto from "crypto"

const generateRefreshToken = async(userId, deviceName) => {
    const refreshTokenExpirationDays = 7;
    let newRefreshToken = crypto.randomBytes(32).toString("hex");
    let hashRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    let expireRefreshToken = new Date(Date.now() + refreshTokenExpirationDays * 24 * 60 * 60 * 1000);
    while(true){
        try{
            await prisma.refreshToken.create({
                data:{
                    tokenHash: hashRefreshToken,
                    expiresAt: expireRefreshToken,
                    userId,
                    deviceName,
                    lastUsedAt: new Date()
                }
            })
            return { newRefreshToken }
        }catch(error){
            if(error.code === "P2002"){
                newRefreshToken = crypto.randomBytes(32).toString("hex");
                hashRefreshToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
                expireRefreshToken = new Date(Date.now() + refreshTokenExpirationDays * 24 * 60 * 60 * 1000);
            }else{
                throw error;
            }
            

        }

    }
    
}

const registerUser = async(req, res) =>{
    //for now hash password so we are not direcly putting passwords in database but once
    //models/schemas are created see if adding hashing there is faster or easier.
    try{
        const { username, email, password, confirmPassword, deviceName } = req.body;
        if(!username || !email || !password || !confirmPassword){
            return res.status(400).json({ message: "All fields needs to be filled." })
        }
        if(!deviceName){
            return res.status(400).json({message: "Couldn't get device name"});
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
        //sendWelcomeEmail(email);

  
        //generate JWT token
        const token = generateToken(user.id);
        const { newRefreshToken } = await generateRefreshToken(user.id, deviceName);

        return res.status(201).json({
            message: "User was successfully registered!",
            data: {
                user:{ 
                    username: user.username, 
                    email: user.email
                } 
            },
            token,
            refreshToken: newRefreshToken
        });
        
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
        const { deviceName } = req.body;
        if(!deviceName){
            return res.status(400).json({message: "No device name given"});
        }
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
        const { newRefreshToken } = await generateRefreshToken(user.id, deviceName);

        const token = generateToken(user.id);
        return res.status(200).json({
            message: "User was successful with logging in with Google",
            isNewUser: userStatus,
            token,
            refreshToken: newRefreshToken
        });
        
    } catch (error) {
        console.error(`Error with using Google to signup/login: ${error}`)
        return res.status(500).json({message: "Internal server error"})
    }
}

const loginUser = async(req, res)=>{
    try{
        const{ email, password, deviceName } = req.body;
        if( !email || !password ){
            return res.status(400).json({message: "All fields needs to be filled."});
        }
        if(!deviceName){
            return res.status(400).json({message:"No device name"});
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
        const { newRefreshToken } = await generateRefreshToken(userExist.id, deviceName);


        return res.status(200).json({
            message: "User successfully logged in!",
            data: {
                user:{
                    email: userExist.email
                }
            },
            token,
            refreshToken: newRefreshToken
        })


    }catch(error){
        console.error(`Error logging in user: ${error}`);
        return res.status(500).json({message: `Internal Server Error`});
    }
}
/* 
    Now deals with checking if token is unique when trying to send to database. If it 
    fails try creating another resetToken.

*/
const generateResetToken = async(userId) =>{
    let resetToken = crypto.randomBytes(32).toString("hex");
    console.log(`function restToken ${resetToken}`)
    let hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    let expireAt = new Date(Date.now() + 15 * 60 * 1000);//expire in 15 minutes
    while(true){
        try{
            await prisma.passwordResetToken.create({
                data: {
                    userId,
                    token: hashResetToken,
                    expiresAt: expireAt,
                }
            })
            return { resetToken }

        }catch(error){
            if(error.code === "P2002"){
                resetToken = crypto.randomBytes(32).toString("hex");
                hashResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
                expireAt = new Date(Date.now() + 15 * 60 * 1000);
            }else{
                throw error;
            }
        }
    }
}

const forgotPassword = async(req, res) =>{
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
        if(!user){
            return res.status(200).json({message: "If an account exists, we've sent password reset instructions."});
        }

        const existingResetTokens = await prisma.passwordResetToken.findMany({
            where:{userId: user.id}
        });

        const activeResetToken = existingResetTokens.find((resetToken) => resetToken.expiresAt > Date.now());
        if(activeResetToken){
            return res.status(400).json({message: "A password reset email was recently sent. Please wait a few more minutes before requesting another one."});
        }

        if(existingResetTokens.length > 0){
            await prisma.passwordResetToken.deleteMany({
                where: { userId: user.id }
            });
        }

        const { resetToken } = await generateResetToken(user.id);

        //const url = `${process.env.DEEP_LINK_URL}?token=${encodeURIComponent(resetToken)}`
        //console.log(url);
        //call sendEmail
        //await sendForgotPasswordEmail(user.email, url);
        await sendForgotPasswordEmail(user.email);
        return res.status(200).json({message: "If an account exists, we've sent password reset instructions."})          
    }catch(error){
        return res.status(500).json({message:`Internal Server Error`});
    }
}

const changePassword = async(req,res) =>{
    try{
        const { newPassword, token } = req.body;
        if(!newPassword){
            return res.status(400).json({message: "Nothing was sent for password"});
        }
        if(!token){
            return res.status(400).json({message: "Something went wrong with token"});
        }

        const hashGivenToken = crypto.createHash("sha256").update(token).digest("hex");
        const findResetToken = await prisma.passwordResetToken.findUnique({
            where: {token: hashGivenToken}
        });
        if(!findResetToken){
            return res.status(400).json({message: "Invalid token"});
        }

        if(findResetToken.expiresAt < Date.now()){
            await prisma.passwordResetToken.delete({
                where: { id: findResetToken.id }
            });
            return res.status(400).json({message: "Time has expired"});
        }

        const findUser = await prisma.user.findUnique({
            where:{id: findResetToken.userId}
        })
        
        if(!findUser){
            return res.status(400).json({message: "No user found."});//shouldn't really get to this point up to now. But just in case
        }
        const isPasswordValid = await bcrypt.compare(newPassword, findUser.password);
        if(isPasswordValid){
            return res.status(400).json({message: "Password must be different than present password"});
        }
        const checkRegPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/.test(newPassword);
        if(!checkRegPassword){
            return res.status(400).json({message: "Password needs to be 8 characters long. Must contain a uppercase, lowercase, unique character (@$!%*&#), and a digit."})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        const user = await prisma.user.update({
            where:{id:findResetToken.userId},
            data: {password:hashedPassword}
        });
        await prisma.passwordResetToken.deleteMany({
            where: { userId: findResetToken.userId }
        });
        return res.status(200).json({message: "Successfully changed password!"});
    }catch(error){
        return res.status(500).json({message: "Internal Server Error"});
    }
}

/*Create a html file later if I want to create a web version
This is to check once we deploy backend*/
const openResetPassword = (req, res)=>{
    const {token} = req.query();
    res.send(`
    <!DOCTYPE html>
    <html>
        <body>
            <h2>Opening GLSocial</h2>

            <script>
                window.location.href=
                    "${process.env.DEEP_LINK_URL}?token=${token}"
            </script>
        </body>
    </html>
    `)
}

//Can add deviceName/platform/lastUsedAt
const refreshToken = async(req,res)=>{
    try {
        const { refreshToken, deviceName } = req.body;
        if(!refreshToken){
            return res.status(400).json({message: "Unauthorized user"});
        }
        if(!deviceName){
            return res.status(400).json({message: "No device name was sent"});
        }

        const hashRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const refreshInfo = await prisma.refreshToken.findUnique({
            where: {tokenHash: hashRefreshToken}
        });

        if(!refreshInfo){
            return res.status(401).json({message: "Unauthorized user"});
        }
        if(refreshInfo.expiresAt < Date.now()){
            return res.status(401).json({message: "Time has exceeded"});
        }
        if(refreshInfo.revokedAt !== null){
            return res.status(401).json({message: "Unauthorized user"});
        }

        await prisma.refreshToken.update({
            where: {id: refreshInfo.id},
            data: {revokedAt: new Date()}
        })

        const token = generateToken(refreshInfo.userId);
        const { newRefreshToken } = await generateRefreshToken(refreshInfo.userId, deviceName);

        console.log("created new token");
        return res.status(200).json({
            message: "Successfully refreshed token",
            token,
            refreshToken: newRefreshToken
        })

    } catch (error) {
        console.error(`Error with refreshing tokens: ${error}`);
        return res.status(500).json({message:  `Internal Server Error`});
    }
}

const logoutUser = async(req,res)=>{
    try{
        const { refreshToken } = req.body;
        
        if(!refreshToken){
            return res.status(400).json({message: "Unauthorize user"})
        }

        const hashRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const tokenInfo = await prisma.refreshToken.findUnique({
            where: {tokenHash: hashRefreshToken}
        });

        if(!tokenInfo){
            return res.status(401).json({message: "Unauthorized user"});
        }

        await prisma.refreshToken.update({
            where: {id: tokenInfo.id},
            data: {revokedAt: new Date()}
        });


        return res.status(200).json({message:"logout successful"});
    }catch(error){
        console.error(`Error logging user out: ${error}`)
        return res.status(500).json({message:`Internal Server Error:`})
    }
}
export{
    registerUser, loginUser, logoutUser, googleLogin, forgotPassword, changePassword, refreshToken, openResetPassword
};