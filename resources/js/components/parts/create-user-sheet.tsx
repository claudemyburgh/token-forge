import CreateUserForm from '@/components/parts/form/create-user-form';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export default function CreateUserSheet() {
    return (
        <Sheet>
            <SheetTrigger>
                <Button>Create User</Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[740px]">
                <SheetHeader className={`space-y-6`}>
                    <SheetTitle>Create a new User</SheetTitle>
                    <SheetDescription>
                        <CreateUserForm />
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
