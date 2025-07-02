import { useState } from "react";
export type AuthFormTypes = 'LOGIN' | 'SIGNUP'
export function useAuthForm(defaultForm: AuthFormTypes) {
    const [selectedForm, setSelectedForm] = useState<AuthFormTypes>(defaultForm)


    const toSignUp = () => {
        setSelectedForm("SIGNUP")
    }

    const toLogin = () => {
        setSelectedForm("LOGIN")
    }

    return { selectedForm, toSignUp, toLogin }
}