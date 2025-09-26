import AdminUsersController from '@/actions/App/Http/Controllers/Admin/AdminUsersController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EditUserForm({ user }: { user: User }) {
    return (
        <Form
            {...AdminUsersController.update.form(user)}
            onSuccess={() => {
                toast.success('User updated successfully.');
            }}
            disableWhileProcessing
            className="flex flex-col gap-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                autoFocus
                                defaultValue={user.name}
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                placeholder="Full name"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                tabIndex={2}
                                defaultValue={user.email}
                                autoComplete="email"
                                name="email"
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Verified Email</Label>
                            <Input
                                id="email_verified_at"
                                type="date"
                                tabIndex={4}
                                autoComplete="email_verified_at"
                                name="email_verified_at"
                            />
                            <InputError
                                message={errors.email_verified_at}
                                className="mt-2"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            tabIndex={5}
                            data-test="register-user-button"
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Update User
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
