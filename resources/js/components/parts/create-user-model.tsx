import CreateUserForm from '@/components/parts/form/create-user-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function CreateUserModal() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Create User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={`mb-6`}>
                        Create a new user
                    </DialogTitle>
                    <DialogDescription>
                        <CreateUserForm />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
