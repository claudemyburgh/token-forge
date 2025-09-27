import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { type BreadcrumbItem, User } from '@/types';

import { Head } from '@inertiajs/react';
import { ArrowUpDown, BadgeXIcon, VerifiedIcon } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import CreateUserModal from '@/components/parts/create-user-model';
import EditUserModal from '@/components/parts/edit-user-model';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { can } from '@/lib/can';
import { index as adminUserIndex } from '@/routes/admin/users';
import { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow } from 'date-fns';

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
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <button
                    className={`group flex w-12 max-w-12 cursor-pointer items-center space-x-2`}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    ID
                    <ArrowUpDown className="ml-2 hidden h-4 w-4 group-hover:inline-block" />
                </button>
            );
        },
    },
    {
        accessorKey: 'avatar',
        header: 'AVATAR',
        cell: ({ row }) => (
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={row.original.avatar}
                    alt={row.original.name}
                />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {row.original.avatar}
                </AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <button
                    className={`group flex cursor-pointer items-center space-x-2`}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    NAME
                    <ArrowUpDown className="ml-2 hidden h-4 w-4 group-hover:inline-block" />
                </button>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <button
                    className={`group flex cursor-pointer items-center space-x-2`}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    EMAIL ADDRESS
                    <ArrowUpDown className="ml-2 hidden h-4 w-4 group-hover:inline-block" />
                </button>
            );
        },
    },
    {
        accessorKey: 'email_verified_at',
        header: 'EMAIL VERIFIED',
        cell: ({ row }) => (
            <div className={`flex items-center justify-start`}>
                {row.original.email_verified_at ? (
                    <Badge
                        variant="outline"
                        className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90"
                    >
                        <VerifiedIcon className="size-3" />
                        Verified
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400 [a&]:hover:bg-rose-600/10 [a&]:hover:text-rose-600/90 dark:[a&]:hover:bg-rose-400/10 dark:[a&]:hover:text-rose-400/90"
                    >
                        <BadgeXIcon className="size-3" />
                        Not Verified
                    </Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'CREATED AT',
        cell: ({ row }) => (
            <div>{formatDistanceToNow(new Date(row.original.created_at))}</div>
        ),
    },
    {
        accessorKey: 'updated_at',
        header: 'UPDATED AT',
        cell: ({ row }) => (
            <div>{format(new Date(row.original.updated_at), 'MM/dd/yyyy')}</div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <EditUserModal user={row.original} />,
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
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage users</CardDescription>
                        <CardAction>
                            {can('create-users') && <CreateUserModal />}
                        </CardAction>
                    </CardHeader>
                    <DataTable columns={columns} data={users.data} />
                </Card>
            </div>
        </AppLayout>
    );
}
