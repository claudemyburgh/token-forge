import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import route from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PageProps } from '@/types';

export default function AccessControl({ roles, permissions, users }: PageProps<{ roles: any[], permissions: any[], users: any[] }>) {
    const { data: roleData, setData: setRoleData, post: postRole, processing: processingRole, errors: roleErrors } = useForm({ name: '' });
    const { data: permissionData, setData: setPermissionData, post: postPermission, processing: processingPermission, errors: permissionErrors } = useForm({ name: '' });
    const { data: assignRoleData, setData: setAssignRoleData, post: postAssignRole, processing: processingAssignRole, errors: assignRoleErrors } = useForm({ user_id: '', role_name: '' });

    const submitRole = (e: React.FormEvent) => {
        e.preventDefault();
        postRole(route('admin.roles.store'));
    };

    const submitPermission = (e: React.FormEvent) => {
        e.preventDefault();
        postPermission(route('admin.permissions.store'));
    };

    const submitAssignRole = (e: React.FormEvent) => {
        e.preventDefault();
        postAssignRole(route('admin.assign-role.store'));
    };

    return (
        <AppLayout>
            <Head title="Access Control" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitRole} className="space-y-4">
                                <div>
                                    <Label htmlFor="role-name">Role Name</Label>
                                    <Input
                                        id="role-name"
                                        type="text"
                                        value={roleData.name}
                                        onChange={(e) => setRoleData('name', e.target.value)}
                                    />
                                    {roleErrors.name && <p className="text-red-500 text-xs mt-1">{roleErrors.name}</p>}
                                </div>
                                <Button type="submit" disabled={processingRole}>Create</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Create Permission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitPermission} className="space-y-4">
                                <div>
                                    <Label htmlFor="permission-name">Permission Name</Label>
                                    <Input
                                        id="permission-name"
                                        type="text"
                                        value={permissionData.name}
                                        onChange={(e) => setPermissionData('name', e.target.value)}
                                    />
                                    {permissionErrors.name && <p className="text-red-500 text-xs mt-1">{permissionErrors.name}</p>}
                                </div>
                                <Button type="submit" disabled={processingPermission}>Create</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Assign Role to User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitAssignRole} className="space-y-4">
                                <div>
                                    <Label>User</Label>
                                    <Select onValueChange={(value) => setAssignRoleData('user_id', value)} value={assignRoleData.user_id}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {assignRoleErrors.user_id && <p className="text-red-500 text-xs mt-1">{assignRoleErrors.user_id}</p>}
                                </div>
                                <div>
                                    <Label>Role</Label>
                                    <Select onValueChange={(value) => setAssignRoleData('role_name', value)} value={assignRoleData.role_name}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {assignRoleErrors.role_name && <p className="text-red-500 text-xs mt-1">{assignRoleErrors.role_name}</p>}
                                </div>
                                <Button type="submit" disabled={processingAssignRole}>Assign Role</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Roles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {roles.map(role => (
                                        <li key={role.id}>{role.name}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Permissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {permissions.map(permission => (
                                        <li key={permission.id}>{permission.name}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {users.map(user => (
                                        <li key={user.id}>{user.name}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
