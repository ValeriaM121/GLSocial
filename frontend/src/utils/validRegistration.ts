type formtype = {username: string, email: string, password: string, confirmPassword: string};
    
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex =  /^[a-z][a-z0-9._]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/;
    
export const validateRegister = (form: formtype) =>{
    if(!form.username || !form.email || !form.password || !form.confirmPassword){
        return "All fields needs to be filled";
    }
    if(!usernameRegex.test(form.username)){
        return "Invalid username (All lowercase and needs to be 3 characters long)";
    }
    if(!emailRegex.test(form.email)){
        return "Invalid email input";
    }
    if(!passwordRegex.test(form.password)){
        return "Password needs to be 8 characters long. Must contain uppercase, lowercase, unique character (@$!%*?&#) and a number";
    }
    if(form.password !== form.confirmPassword){
        return "Password must match";
    }
}
