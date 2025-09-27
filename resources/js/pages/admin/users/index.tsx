import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { index as adminUserIndex } from '@/routes/admin/users';
import { type BreadcrumbItem, User } from '@/types';
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

export default function AdminUsersIndex({
    users,
}: {
    users: {
        data: User[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: {
                url: string | null;
                label: string;
                active: boolean;
            }[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admistration Users" />

            <div className="p-6">
                <DataTable columns={columns} data={users} />
            </div>
        </AppLayout>
    );
}
