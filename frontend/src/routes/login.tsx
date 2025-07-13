import LoginForm from '@feature/auth/components/Login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    component: LoginForm
})

