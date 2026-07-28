import SignUp from "@/app/signup"
import { render,screen } from "@testing-library/react-native"

describe("Signup Screen", () =>{
    it("has all fields all users need", ()=>{
        render(<SignUp />);

        expect(screen.getByPlaceholderText("Enter Username")).toBeTruthy();
        expect(screen.getByPlaceholderText("Enter email")).toBeTruthy();
        expect(screen.getByPlaceholderText("Enter password")).toBeTruthy();
        expect(screen.getByPlaceholderText("Confirm password")).toBeTruthy();
    });

    it("has sign up button", () => {
        render(<SignUp/>);
        expect(screen.getByTestId("signup-button")).toBeTruthy();
    });

    it("directs to login page when click login", () =>{
        render(<SignUp/>);

        const loginLink = screen.getByTestId("login-link");
        expect(loginLink.props.href).toBe("/login");
    });

    it("contains google button", () =>{
        render(<SignUp />);
        expect(screen.getByTestId("googlebutton")).toBeTruthy();
    });
})