import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as adminUserIndex } from '@/routes/admin/users';
import { type BreadcrumbItem, Paginated, User } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './columns';

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

interface AdminUsersIndexProps {
    users: Paginated<User>;
    roles: string[];
    filters: {
        search?: string;
        roles?: string[];
        per_page?: string;
    };
}

export default function AdminUsersIndex({
    users,
    roles,
    filters,
}: AdminUsersIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admistration Users" />

            <div className="p-6">
                <DataTable
                    columns={columns}
                    data={users}
                    roles={roles}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
