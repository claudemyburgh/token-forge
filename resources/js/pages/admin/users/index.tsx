import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { type BreadcrumbItem, User } from '@/types';

import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import CreateUserModal from '@/components/parts/create-user-model';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { can } from '@/lib/can';
import { index as adminUserIndex } from '@/routes/admin/users';
import { ColumnDef } from '@tanstack/react-table';

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

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => {
            return (
                <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <AvatarImage
                        src={row.original.avatar}
                        alt={row.original.name}
                    />
                    <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {row.original.avatar}
                    </AvatarFallback>
                </Avatar>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'created_at',
        header: 'Created at',
    },
    {
        accessorKey: 'email_verified_at',
        header: 'Email verified',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <Button variant={`destructive`} size={'xs'}>
                    Delete {row.original.id}
                </Button>
            );
        },
    },
];

export default function AdminUsersIndex({
    users,
}: {
    users: { data: User[] };
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Users" />
            <div className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage users</CardDescription>
                        <CardAction>
                            {can('create-users') && <CreateUserModal />}
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={users.data}
                            pagination={{
                                current_page: users.links.current_page,
                                last_page: users.links.last_page,
                                per_page: users.links.per_page,
                                total: users.links.total,
                                from: users.links.from,
                                to: users.links.to,
                            }}
                            // filters={{
                            //     search: filters.search,
                            //     sort_field: filters.sort_field,
                            //     sort_direction: filters.sort_direction,
                            //     per_page: filters.per_page,
                            // }}
                            enableSelection={true}
                            // onBulkAction={handleBulkAction}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
