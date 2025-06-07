import Home from '@pages/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Home')({
    component: Home,
})
