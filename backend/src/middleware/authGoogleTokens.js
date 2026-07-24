import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleTokens = async (req,res,next) => {
    const { idToken }= req.body;
    if(!idToken){
        return res.status(401).json({message: "Missing Google ID token"});
    }
    try{
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        req.user = ticket.getPayload();
        next();
    }catch(error){
        return res.status(401).json({message: `Not Authorized: ${error}`})
    }

}