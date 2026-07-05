import Card from '@/Components/Card';
import PageHeader from '@/Components/PageHeader';
import AppShell from '@/Layouts/AppShell';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppShell>
            <Head title="Profile" />

            <PageHeader
                title="Profile"
                description="Your account details and password."
            />

            <div className="space-y-4">
                <Card className="p-5 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </Card>

                <Card className="p-5 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </Card>

                <Card className="p-5 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </Card>
            </div>
        </AppShell>
    );
}
