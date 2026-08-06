import { Resend } from 'resend';
const key = process.env.RESEND_API_KEY
const resend = new Resend(key);

//Not just token is sent it's url + token 
//We will do this by deep linking because I feel like we will use deep linking anyways

export const sendWelcomeEmail = async(email) =>{
    resend.emails.send({
        from: `onboarding@resend.dev`,
        to: `${email}`,
        subject: "Welcome to GLSocial",
        html:`
        <h2> Welcome to GLSocial! <br></br></h2>
        <p>This is a personal project that was created to help users who like GL content to be able to communicate together. Also 
        discover more gl content. I hope everyone who gets to use this app enjoys it. If there's anything that can be improved put
        your feelings out there and let me know.
        </p>
        `
    })
}

export const sendForgotPasswordEmail = async (email)=>{
    console.log(url);//Once deployed don't need to log this & would use backend url after deployed.
    try{
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset Password',
        html:`
        <body>
            <div style="text-align: center">
                <h2>Reset Your Password</h2>
                <p>Just click the button at the bottom to change your password. This will expire in 15 minutes. </p>
                <a href="https://glsocial.onrender.com/resetPassword" style="display:inline-block; background-color:#636AE8FF; color:white; padding: 15px; border-radius:8px; text-decoration: none; font-weight: bold;">Reset Password</a>
                
            </div>
        </body>
        `
    })
    }catch(error){
        console.error(error);
    }      
}