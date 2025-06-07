import LeagueHome from '@pages/LeaguesHome'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/LeaguesHome/$leaugeId')({
    component: LeagueHome,
})

