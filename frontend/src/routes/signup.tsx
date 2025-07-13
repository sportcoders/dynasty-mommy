
import SignUpForm from '@feature/auth/components/SignUp'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
    component: SignUpForm,
})

