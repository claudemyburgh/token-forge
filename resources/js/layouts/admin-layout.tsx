import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AdminLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem eum
        molestias officiis optio quasi? Commodi eligendi laudantium, modi neque
        quidem reiciendis rem repellat sint sit tenetur veniam voluptate
        voluptatum! Nulla.
        <Toaster position={`top-right`} />
    </AppLayoutTemplate>
);
