import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { can } from '@/lib/can';
import { admin, dashboard } from '@/routes';
import { index as adminUserIndex } from '@/routes/admin/users';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    HeadsetIcon,
    LayoutGrid,
    MailIcon,
    UsersRoundIcon,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Administration',
        href: admin(),
        icon: UsersRoundIcon,
    },
    {
        title: 'Users',
        href: adminUserIndex(),
        icon: UsersRoundIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Support',
        href: '#',
        icon: HeadsetIcon,
    },
    {
        title: 'Contact Us',
        href: '#',
        icon: MailIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {can('view-users') ? (
                    <NavMain items={adminNavItems} label={`Administrator`} />
                ) : (
                    <NavMain items={mainNavItems} label={`Platform`} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
