import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

import { type BreadcrumbItem, User } from '@/types';

import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { BadgeXIcon, EyeIcon, Trash2Icon, VerifiedIcon } from 'lucide-react';

import CreateUserModal from '@/components/parts/create-user-model';
import EditUserModal from '@/components/parts/edit-user-model';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { can } from '@/lib/can';
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
            <Head title="Admin Users" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage users</CardDescription>
                        <CardAction>
                            {can('create user') && <CreateUserModal />}
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableCaption>A list of users</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={`w-10`}>
                                        Avatar
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        Name
                                    </TableHead>
                                    <TableHead>Email Address</TableHead>
                                    <TableHead>Email Verified</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">
                                        Action
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user: User) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {user.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.email_verified_at ? (
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
                                        </TableCell>
                                        <TableCell>{user.created_at}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button
                                                type={`button`}
                                                variant={`secondary`}
                                                size={`xs`}
                                            >
                                                <EyeIcon />
                                                <span className={`sr-only`}>
                                                    View
                                                </span>
                                            </Button>
                                            <EditUserModal user={user} />

                                            <Button
                                                type={`button`}
                                                variant={`destructive`}
                                                size={`xs`}
                                            >
                                                <Trash2Icon />
                                                <span className={`sr-only`}>
                                                    Delete
                                                </span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="@container/main flex flex-1 flex-col gap-2 py-4">
                <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                    {users.data.map((user: User) => (
                        <Card key={user.id}>
                            <CardHeader>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.email}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
