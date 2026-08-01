const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateForgotPassword = (email:string) =>{
    if(!email){
        return "Field needs to be filled";
    }
    if(!emailRegex.test(email)){
        return "Invalid email";
    }
}