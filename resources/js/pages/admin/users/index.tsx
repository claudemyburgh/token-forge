import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { type BreadcrumbItem, User } from '@/types';

import { Head } from '@inertiajs/react';

import { index as adminUserIndex } from '@/routes/admin/users';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Users List',
        href: adminUserIndex().url,
    },
];

export default function AdminUsersIndex({
    users,
}: {
    users: { data: User[] };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admistration Users" />

            <div className="p-6">
                <pre>{JSON.stringify(users, null, 2)}</pre>
            </div>
        </AppLayout>
    );
}
