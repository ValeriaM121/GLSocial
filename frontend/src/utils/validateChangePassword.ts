const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/;
type passwordForm = {password: string, confirmPassword:string}

export const ChangePasswordValidation = (password:passwordForm) =>{
    if(!password.password || !password.confirmPassword){
        return "All fields needs to be filled";
    }

    if(!passwordRegex.test(password.password)){
        return "Password needs to be 8 characters long. Must contain uppercase, lowercase, unique character (@$!%*?&#) and a number";
    }

    if(password.password !== password.confirmPassword){
        return "Passwords don't match";
    }
}