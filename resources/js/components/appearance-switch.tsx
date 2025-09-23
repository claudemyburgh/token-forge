'use client';

import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';

import { useAppearance } from '@/hooks/use-appearance'; // Updated import path
import { cn } from '@/lib/utils';
import { MoonIcon, SunMediumIcon } from 'lucide-react';

// Replace the `Switch` component in `@components/ui/switch` with below component and use it here to support this customization.
const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
        icon?: React.ReactNode;
        thumbClassName?: string;
    }
>(({ className, icon, thumbClassName, ...props }, ref) => (
    <SwitchPrimitive.Root
        className={cn(
            'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitive.Thumb
            className={cn(
                'pointer-events-none flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
                thumbClassName,
            )}
        >
            {icon ? icon : null}
        </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

const AppearanceSwitch = () => {
    const { appearance, updateAppearance } = useAppearance();

    // Determine if we're in dark mode based on current appearance and system preference
    const isDarkMode = React.useMemo(() => {
        if (appearance === 'dark') return true;
        if (appearance === 'light') return false;
        // For system mode, check the actual preference
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    }, [appearance]);

    const handleToggle = (checked: boolean) => {
        // If currently on system mode, switch to the opposite of what system prefers
        // Otherwise, toggle between light and dark
        if (appearance === 'system') {
            const systemPrefersDark =
                typeof window !== 'undefined'
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    : false;
            updateAppearance(systemPrefersDark ? 'light' : 'dark');
        } else {
            updateAppearance(checked ? 'dark' : 'light');
        }
    };

    return (
        <Switch
            icon={
                isDarkMode ? (
                    <MoonIcon className="h-4 w-4" />
                ) : (
                    <SunMediumIcon className="h-4 w-4" />
                )
            }
            checked={isDarkMode}
            onCheckedChange={handleToggle}
            className="h-7 w-12"
            thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
        />
    );
};

// Remove the alternative component since you only need light/dark toggle
export default AppearanceSwitch;
