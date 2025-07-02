import { useState } from "react"

export default function useLoginForm() {
    const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [error, setError] = useState("")
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailError("")
        setEmail(e.target.value)
    }
    const handleSubmit = () => {
        setEmailError("")
        setError("")
        if (!email || !password) {
            setError("Missing Fields")
            return
        }
        if (!email.toLowerCase().match(reEmail)) {
            setEmailError("Invalid Email Format")
            return
        }
    }
    return { email, handleEmailChange, password, setPassword, handleSubmit, emailError, error }
}