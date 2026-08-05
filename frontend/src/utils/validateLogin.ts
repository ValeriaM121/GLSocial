type formtype = {email: string, password: string};
    
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
export const validateLogin = (form: formtype) =>{
    if(!form.email || !form.password){
        return "All fields needs to be filled";
    }
    if(!emailRegex.test(form.email)){
        return "Invalid email input";
    }
}