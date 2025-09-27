import StatCard from '@/components/parts/stat-card';
import AppLayout from '@/layouts/app-layout';
import {dashboard} from '@/routes';
import type {BreadcrumbItem} from '@/types';
import {Head} from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Administrador',
        href: dashboard().url,
    },
];

export default function AppDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admistration" />
            <div className="@container/main flex flex-1 flex-col gap-2 py-4">
                <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                    <StatCard />
                    <StatCard />
                    <StatCard />
                </div>
            </div>
        </AppLayout>
    );
}
