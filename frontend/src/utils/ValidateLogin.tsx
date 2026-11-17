type formType = {email:string, password:string};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&$#])[A-Za-z\d@$!%*?&#]{8,50}$/;

export const ValidateLogin = (form: formType) => {
    if(!form.email || !form.password){
        return "All fields needs to be filled.";
    }
    if(!emailRegex.test(form.email)){
        return "Invalid Email Input";
    }
    if(!passwordRegex.test(form.password)){
        return "Password needs to be 8 characters long. Must contain uppercase, a lowercase, a unique character (@$!%*>&#) and a digit.";
    }
}