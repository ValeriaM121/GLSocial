import { prisma } from "../config/database.js"
import bcrypt from "bcryptjs"

const getUsername = async(req, res)=>{
    try{
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });

        if(!user){
            return res.status(400).json({message: "User was not found"});
        };
        return res.status(200).json({message: "Successful", username: user.username})

    }catch(error){
        console.error(`Get username error: ${error}`)
        return res.status(500).json({message: "Internal Server Error"})
    }   
}

const updateUsername = async(req, res) =>{
    try{
        const userId = req.user.id;
        const { username } = req.body;

        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        
        if(!user){
            return res.status(400).json({message: "User was not found"});
        }

        if(!username){
            return res.status(400).json({message: "Need to fill up the field"});
        }
        
        if(user.username === username){
            return res.status(400).json({message: "This is your current username"});
        }

        const checkUsername = await prisma.user.findUnique({
            where: {username: username}
        })

        if(checkUsername){
            return res.status(400).json({message: "Username already exists. Try a different username."})
        }

        const checkRegUsername = /^[a-z][a-z0-9._]{2,}$/.test(username);
        if(!checkRegUsername){
            return res.status(400).json({message: "Username must be 3 characters long. Starting with lowercase"})
        }
        
        await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                username
            }
        });
        
        return res.status(200).json({message: `Username was successfully updated to ${username}`, username: username});   
 
    }catch(error){
        console.error(`Error updating username: ${error}`);
        return res.status(500).json({message: `Internal Server Error: ${error}`})
    }
}

const getEmail = async(req,res)=>{
    try{
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        if(!user){
            return res.status(400).json({message:"User was not found"});
        }
        return res.status(200).json({message: "Successful in getting User's email", email: user.email})

    }catch(error){
        console.error(`Error in getting user email: ${error}`)
        return res.status(500).json({message: `Internal Server Error: ${error}`})
    }
}

const updateEmail = async (req,res)=>{
    try{
        const userId = req.user.id;
        const { email } = req.body;

        if(!email){
            return res.status(400).json({message: "Need to fill up the field"});
        }

        const lowerEmail = email.toLowerCase();

        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            return res.status(400).json({message: "User was not found"});
        }

        if(user.email === lowerEmail){
            return res.status(400).json({message: "This is the email you are currently using"});
        }

        const existEmail = await prisma.user.findUnique({
            where: {email: lowerEmail}
        });

        if(existEmail){
            return res.status(400).json({message: "This email is already connected to another account."});
        }

        const regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        if(!regEmail){
            return res.status(400).json({message: "Invalid email"});
        }
        await prisma.user.update({
            where:{id:userId},
            data:{
                email: lowerEmail
            }
        })
        return res.status(200).json({message:"Successfully updated email", email: lowerEmail});

    }catch(error){
        console.error(`Error updating user email: ${error}`)
        return res.status(500).json({message:`Internal Server Error ${error}`})
    }
}

const updatePassword = async (req,res) =>{
    try{
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        if( !currentPassword || !newPassword || !confirmNewPassword){
            return res.status(400).json({message: "All fields needs to be filled"});
        }

        const user = await prisma.user.findUnique({
            where: {id: userId}
        });

        if(!user){
            return res.status(400).json({message: "No User Found"});
        }

        const compareCurrPass = await bcrypt.compare(currentPassword, user.password);
        if(!compareCurrPass){
            return res.status(400).json({message: "Current password is incorrect"});
        }

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/.test(newPassword);
        if(!regexPassword){
            return res.status(400).json({message: "Password needs to be 8 characters long. Must contain a uppercase, lowercase, unique character (@$!%*&#), and a digit."})
        }

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: "New Password and Confirm Passwords don't match"});
        }
        if(currentPassword === newPassword || currentPassword === confirmNewPassword){
            return res.status(400).json({message: "New password needs to be different than old password"});
        }

        
        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword,salt);

        await prisma.user.update({
            where: {id:userId},
            data: {
                password: hashedNewPassword
            }
        });


        return res.status(200).json({message:"Successfully updated user password"});

    }catch(error){
        console.error(`Failed to update user password: ${error}`)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export {
    getUsername,
    updateUsername,
    getEmail,
    updateEmail,
    updatePassword
}