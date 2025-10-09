import ProfilePage from '@pages/ProfilePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/profile')({
    component: ProfilePage,
});
