'use client';

import * as React from 'react';
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import {ArrowUpDown, ChevronDown, Download, MoreHorizontal, Settings2, Trash2, UserPlus, X,} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Input} from '@/components/ui/input';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Badge} from '@/components/ui/badge';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {toast} from 'sonner'; // Mock data type

// Mock data type
export type User = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'user' | 'moderator';
    status: 'active' | 'inactive' | 'pending';
    lastLogin: string;
    joinDate: string;
};

// Generate mock data
const generateMockUsers = (): User[] => {
    const roles: User['role'][] = ['admin', 'user', 'moderator'];
    const statuses: User['status'][] = ['active', 'inactive', 'pending'];
    const names = [
        'Alice Johnson',
        'Bob Smith',
        'Charlie Brown',
        'Diana Prince',
        'Eve Wilson',
        'Frank Miller',
        'Grace Lee',
        'Henry Davis',
        'Ivy Chen',
        'Jack Wilson',
        'Kate Thompson',
        'Liam Garcia',
        'Maya Patel',
        'Noah Kim',
        'Olivia Martinez',
        'Paul Anderson',
        'Quinn Taylor',
        'Ruby Jackson',
        'Sam White',
        'Tina Moore',
        'Uma Singh',
        'Victor Lopez',
        'Wendy Clark',
        'Xavier Rodriguez',
        'Yuki Tanaka',
        'Zoe Williams',
        'Alex Turner',
        'Blake Cooper',
        'Chloe Evans',
        'Dylan Foster',
    ];

    return names.map((name, index) => ({
        id: `user-${index + 1}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        lastLogin: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        )
            .toISOString()
            .split('T')[0],
        joinDate: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
        )
            .toISOString()
            .split('T')[0],
    }));
};

export function UsersDataTable() {
    const [data, setData] = React.useState<User[]>(generateMockUsers());
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            select: true,
            name: true,
            role: true,
            status: true,
            lastLogin: true,
            joinDate: true,
            actions: true,
        });
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState('');

    const handleClearFilters = () => {
        setGlobalFilter('');
        setColumnFilters([]);
        table.getColumn('role')?.setFilterValue(undefined);
        table.getColumn('status')?.setFilterValue(undefined);
    };

    const hasActiveFilters = globalFilter !== '' || columnFilters.length > 0;

    const columns: ColumnDef<User>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={user.avatar || '/placeholder.svg'}
                                alt={user.name}
                            />
                            <AvatarFallback>
                                {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Role
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                const roleColors = {
                    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                    moderator:
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                    user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                };
                return (
                    <Badge
                        variant="secondary"
                        className={roleColors[role as keyof typeof roleColors]}
                    >
                        {role}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusColors = {
                    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
                    inactive:
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
                    pending:
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
                };
                return (
                    <Badge
                        variant="secondary"
                        className={
                            statusColors[status as keyof typeof statusColors]
                        }
                    >
                        {status}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'lastLogin',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Last Login
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue('lastLogin'));
                return (
                    <div className="text-sm">{date.toLocaleDateString()}</div>
                );
            },
        },
        {
            accessorKey: 'joinDate',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                        className="h-auto p-0 hover:bg-transparent"
                    >
                        Join Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue('joinDate'));
                return (
                    <div className="text-sm">{date.toLocaleDateString()}</div>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(user.id)
                                }
                            >
                                Copy user ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View user</DropdownMenuItem>
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete user
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete the user
                                            account and remove their data from
                                            our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleDeleteUser(user.id)
                                            }
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Search users..."
                        value={globalFilter ?? ''}
                        onChange={(event) =>
                            setGlobalFilter(String(event.target.value))
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />

                    {/* Role Filter */}
                    <Select
                        value={
                            (
                                table
                                    .getColumn('role')
                                    ?.getFilterValue() as string[]
                            )?.join(',') || 'all'
                        }
                        onValueChange={(value) => {
                            const column = table.getColumn('role');
                            column?.setFilterValue(
                                value === 'all' ? undefined : value.split(','),
                            );
                        }}
                    >
                        <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={
                            (
                                table
                                    .getColumn('status')
                                    ?.getFilterValue() as string[]
                            )?.join(',') || 'all'
                        }
                        onValueChange={(value) => {
                            const column = table.getColumn('status');
                            column?.setFilterValue(
                                value === 'all' ? undefined : value.split(','),
                            );
                        }}
                    >
                        <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={handleClearFilters}
                            className="h-8 px-2 lg:px-3"
                        >
                            Clear
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}

                    {selectedRowsCount > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete ({selectedRowsCount})
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete {selectedRowsCount}{' '}
                                        user(s) and remove their data from our
                                        servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            handleDeleteSelected(
                                                table,
                                                setData,
                                                setRowSelection,
                                                toast,
                                            )
                                        }
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete {selectedRowsCount} user(s)
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>

                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings2 className="mr-2 h-4 w-4" />
                                View
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Toggle columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {selectedRowsCount > 0 && (
                        <span>
                            {selectedRowsCount} of{' '}
                            {table.getFilteredRowModel().rows.length} row(s)
                            selected.
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex shrink-0 items-center space-x-2">
                        <p className="text-sm font-medium">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-[100px] shrink-0 items-center justify-center text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </div>
                    <Pagination className="shrink-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    className={
                                        !table.getCanPreviousPage()
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>

                            {/* Generate page numbers with ellipsis */}
                            {(() => {
                                const currentPage =
                                    table.getState().pagination.pageIndex + 1;
                                const totalPages = table.getPageCount();
                                const pages = [];

                                if (totalPages <= 7) {
                                    // Show all pages if 7 or fewer
                                    for (let i = 1; i <= totalPages; i++) {
                                        pages.push(
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        table.setPageIndex(
                                                            i - 1,
                                                        )
                                                    }
                                                    isActive={currentPage === i}
                                                    className="cursor-pointer"
                                                >
                                                    {i}
                                                </PaginationLink>
                                            </PaginationItem>,
                                        );
                                    }
                                } else {
                                    // Show first page
                                    pages.push(
                                        <PaginationItem key={1}>
                                            <PaginationLink
                                                onClick={() =>
                                                    table.setPageIndex(0)
                                                }
                                                isActive={currentPage === 1}
                                                className="cursor-pointer"
                                            >
                                                1
                                            </PaginationLink>
                                        </PaginationItem>,
                                    );

                                    // Show ellipsis if needed
                                    if (currentPage > 3) {
                                        pages.push(
                                            <PaginationItem key="ellipsis1">
                                                <PaginationEllipsis />
                                            </PaginationItem>,
                                        );
                                    }

                                    // Show pages around current page
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(
                                        totalPages - 1,
                                        currentPage + 1,
                                    );

                                    for (let i = start; i <= end; i++) {
                                        pages.push(
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        table.setPageIndex(
                                                            i - 1,
                                                        )
                                                    }
                                                    isActive={currentPage === i}
                                                    className="cursor-pointer"
                                                >
                                                    {i}
                                                </PaginationLink>
                                            </PaginationItem>,
                                        );
                                    }

                                    // Show ellipsis if needed
                                    if (currentPage < totalPages - 2) {
                                        pages.push(
                                            <PaginationItem key="ellipsis2">
                                                <PaginationEllipsis />
                                            </PaginationItem>,
                                        );
                                    }

                                    // Show last page
                                    if (totalPages > 1) {
                                        pages.push(
                                            <PaginationItem key={totalPages}>
                                                <PaginationLink
                                                    onClick={() =>
                                                        table.setPageIndex(
                                                            totalPages - 1,
                                                        )
                                                    }
                                                    isActive={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {totalPages}
                                                </PaginationLink>
                                            </PaginationItem>,
                                        );
                                    }
                                }

                                return pages;
                            })()}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    className={
                                        !table.getCanNextPage()
                                            ? 'pointer-events-none opacity-50'
                                            : 'cursor-pointer'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

const handleDeleteSelected = (
    table: any,
    setData: any,
    setRowSelection: any,
    toast: any,
) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    setData((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
    setRowSelection({});

    toast.success('Users deleted', {
        description: `Successfully deleted ${selectedIds.length} user(s).`,
    });
};

const handleDeleteUser = (userId: string, setData: any, toast: any) => {
    setData((prev) => prev.filter((user) => user.id !== userId));
    toast.success('User deleted', {
        description: 'User has been successfully deleted.',
    });
};
