import { render,screen } from "@testing-library/react-native"
import Login from "@/app/login"

describe("LoginScreen", () =>{
    it("renders login UI",()=>{
        render(<Login />);
        expect(screen.getByText("Sign In")).toBeTruthy();
        expect(screen.getByPlaceholderText("Enter Email")).toBeTruthy();
        expect(screen.getByPlaceholderText("Enter Password")).toBeTruthy();
        expect(screen.getByTestId("login-button")).toBeTruthy();
         
    });
    it("directs to Sign up page when click login", () =>{
        render(<Login />);
    
        const loginLink = screen.getByTestId("signup-link");
        expect(loginLink.props.href).toBe("/signup");
    });
    it("contains google button", () =>{
        render(<Login />);
        expect(screen.getByTestId("googlebutton")).toBeTruthy();
    });
});

