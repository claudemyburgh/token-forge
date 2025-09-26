
import { useState } from 'react';
import { columns, User } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { router } from '@inertiajs/react';

interface AdminUsersPageProps {
    users: User[];
}

const AdminUsersPage = ({ users: initialUsers }: AdminUsersPageProps) => {
    const [users, setUsers] = useState(initialUsers);

    const handleDelete = (selectedRows: User[]) => {
        const selectedIds = selectedRows.map(row => row.id);

        router.delete(route('admin.users.destroy', { ids: selectedIds }), {
            onSuccess: () => {
                const newUsers = users.filter(user => !selectedIds.includes(user.id));
                setUsers(newUsers);
            }
        });
    };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <DataTable
        columns={columns}
        data={users}
        setData={setUsers}
        enablePagination={true}
        enableFiltering={true}
        enableSorting={true}
        enableMultiDelete={true}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminUsersPage;

