import { createUser } from "@services/api/user";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useSignUpFrom() {
    const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const navigate = useNavigate();
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailError("");
        if (!e.target.value.toLowerCase().match(reEmail))
            setEmailError("Invalid Email Format");
        setEmail(e.target.value);
    };
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };
    useEffect(() => {
        setPasswordError("");
        if (password === confirmPassword) return;
        setPasswordError("Passwords don't match");
    }, [password, confirmPassword]);
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (emailError || !(password == confirmPassword)) return;

        if (!username || !email || !password || !confirmPassword) {
            setError("Missing Fields");
        }

        const response = await createUser(username, email, password);
        if (response) {
            //headers are response, if no headers then no authentication
            console.log(response);
            navigate({ to: '/' });
        } else setError("Internal Service Error, Please Try Again");
    };

    return {
        username,
        usernameError,
        handleUsernameChange,
        email,
        emailError,
        handleEmailChange,
        password,
        passwordError,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        handleSubmit,
    };
}
