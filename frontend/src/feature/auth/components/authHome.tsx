import { useAuthForm, type AuthFormTypes } from "../hooks/useAuthForm";
import LoginForm from "./Login";
import SignUpForm from "./Signup";

interface AuthHomeProps {
    selectedFormType?: AuthFormTypes
}
export default function AuthHome({ selectedFormType = "LOGIN" }: AuthHomeProps) {
    const { selectedForm, toLogin, toSignUp } = useAuthForm(selectedFormType)

    if (selectedForm == 'LOGIN')
        return <LoginForm changeToSignUp={toSignUp} />
    else
        return <SignUpForm />
}