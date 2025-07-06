import { DM_login } from "@services/dynasty-mommy/user"
import { useState } from "react"
import { login } from "../authSlice"
import { useAppDispatch } from "@app/hooks"

export default function useLoginForm() {
    const reEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [error, setError] = useState("")
    const dispatch = useAppDispatch()

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailError("")
        setEmail(e.target.value)
    }
    const handleSubmit = async () => {
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
        const user = await DM_login(email, password)
        console.log(user)
        if (user) {

            const username = user.username
            dispatch(login(username))
        }
    }
    return { email, handleEmailChange, password, setPassword, handleSubmit, emailError, error }
}