import Index from "@/app/index"
import { render,screen } from "@testing-library/react-native"

describe("Landing Page",() =>{
    it("renders landing page content", () =>{
        render(<Index />);
        expect(screen.getByText("GLSocial")).toBeTruthy();
    });
    it("has login button and sign up link", () =>{
        render(<Index/>);
        expect(screen.getByTestId("login-button")).toBeTruthy();
        expect(screen.getByTestId("signup-link")).toBeTruthy();
    });
    it("signup link directs to signup page",()=>{
        render(<Index/>);
        const signupLink = screen.getByTestId("signup-link");

        expect(signupLink.props.href).toBe("/signup");
    });
})
