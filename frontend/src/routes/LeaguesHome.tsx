import { createFileRoute } from '@tanstack/react-router'
import LeaguesHome from '@pages/LeaguesHome'

export const Route = createFileRoute('/LeaguesHome')({
    component: LeaguesHome,
})
