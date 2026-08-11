const usernameRegex =  /^[a-z][a-z0-9._]{2,}$/;

export const validateUsername = (username:string) =>{
    if(!username){
        return "Field needs to be filled";
    }
    if(!usernameRegex.test(username)){
        return "Invalid username (All lowercase and needs to be 3 characters long)";
    }
}