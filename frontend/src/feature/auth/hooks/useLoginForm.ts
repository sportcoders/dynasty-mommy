import { DM_login } from "@services/dynasty-mommy/user"
import { useState } from "react"
import { useDispatch } from "react-redux"
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
        const headers = await DM_login(email, password)
        if (headers) {
            const token = headers.get('Authentication')
            console.log(headers.get('Authentication'))
            dispatch(login(token))
        }
    }
    return { email, handleEmailChange, password, setPassword, handleSubmit, emailError, error }
}