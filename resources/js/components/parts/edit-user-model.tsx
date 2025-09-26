import EditUserForm from '@/components/parts/form/edit-user-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { User } from '@/types';
import { EditIcon } from 'lucide-react';

export default function EditUserModal({ user }: { user: User }) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button type={`button`} variant={`secondary`} size={`xs`}>
                    <EditIcon />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <EditUserForm user={user} />
            </DialogContent>
        </Dialog>
    );
}
