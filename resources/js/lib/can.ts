import { usePage } from '@inertiajs/react';

export function can(permission: string): boolean {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { auth } = usePage().props as unknown as {
        auth: {
            permissions: string[];
        };
    };
    return auth.permissions.includes(permission);
}
