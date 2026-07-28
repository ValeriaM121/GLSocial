import { validateRegister } from "@/utils/validRegistration";
import { validateLogin } from "@/utils/validateLogin";
import { render } from "@testing-library/react-native"
import  Index  from "@/app/index"

describe("validateRegister", () => {
    it("returns error when fields are empty", () =>{
        const result = validateRegister({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        expect(result).toBe("All fields needs to be filled");
    });
    it("returns error when username is incorrect", () =>{
        const result = validateRegister({
            username: "ye",
            email: "test",
            password: "e",
            confirmPassword: "e"
        });
        expect(result).toBe("Invalid username (All lowercase and needs to be 3 characters long)")
    });
    it("returns error when email is incorrect", () =>{
        const result = validateRegister({
            username: "test",
            email: "testgmail.com",
            password: "H",
            confirmPassword: "H"
        });
        expect(result).toBe("Invalid email input")
    });
    it("returns error when password isn't strong enough" , () =>{
        const result = validateRegister({
            username: "test",
            email: "test@gmail.com",
            password: "H",
            confirmPassword: "H"
        });
        expect(result).toBe("Password needs to be 8 characters long. Must contain uppercase, lowercase, unique character (@$!%*?&#) and a number")
    });
    it("returns error when password doesn't match" , () =>{
        const result = validateRegister({
            username: "test",
            email: "test@gmail.com",
            password: "Hello#123",
            confirmPassword: "Hello"
        });
        expect(result).toBe("Password must match")
    });
});

describe("validateLogin", () => {
    it("returns error when all fields are empty" , () =>{
        const result = validateLogin({
            email: "",
            password: ""
        });
        expect(result).toBe("All fields needs to be filled")
    });
    it("returns error when invalid email is put in" , () =>{
        const result = validateLogin({
            email: "testgmail.com",
            password: "hi"
        });
        expect(result).toBe("Invalid email input")
    });
});
