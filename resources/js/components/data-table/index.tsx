'use client';

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
import { ChevronDown, Settings2, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { Paginated } from '@/types';
import { router } from '@inertiajs/react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: Paginated<TData>;
    roles: string[];
    filters: {
        search?: string;
        roles?: string[];
        per_page?: string;
    };
}

export function DataTable<TData, TValue>({
    columns,
    data: paginatedData,
    roles,
    filters,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: paginatedData.data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

    const [search, setSearch] = React.useState(filters.search || '');
    const debouncedSearch = useDebounce(search, 500);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const params = new URLSearchParams(window.location.search);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        params.delete('page');

        router.get(
            paginatedData.meta.path,
            Object.fromEntries(params.entries()),
            {
                preserveState: true,
                replace: true,
            },
        );
    }, [debouncedSearch, paginatedData.meta.path]);

    const handleFilterChange = (
        key: 'roles' | 'per_page',
        value: string | string[],
    ) => {
        const params = new URLSearchParams(window.location.search);
        params.delete('page');

        if (Array.isArray(value)) {
            params.delete(`${key}[]`);
            value.forEach((v) => params.append(`${key}[]`, v));
        } else if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
            params.delete(`${key}[]`);
        }

        router.get(
            paginatedData.meta.path,
            Object.fromEntries(params.entries()),
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        router.get(paginatedData.meta.path);
    };

    const isFiltered = !!(filters.search || filters.roles?.length);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(event) =>
                            setSearch(String(event.target.value))
                        }
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                    <Select
                        value={filters.roles?.[0] || 'all'}
                        onValueChange={(value) =>
                            handleFilterChange('roles', value)
                        }
                    >
                        <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={handleReset}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center space-x-2">
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
                            value={`${paginatedData.meta.per_page}`}
                            onValueChange={(value) =>
                                handleFilterChange('per_page', value)
                            }
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={paginatedData.meta.per_page}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[15, 30, 50].map((pageSize) => (
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
                        Page {paginatedData.meta.current_page} of{' '}
                        {paginatedData.meta.last_page}
                    </div>
                    <Pagination className="shrink-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={paginatedData.links.prev}
                                    className={
                                        !paginatedData.links.prev
                                            ? 'pointer-events-none opacity-50'
                                            : undefined
                                    }
                                />
                            </PaginationItem>

                            {paginatedData.meta.links.map((link, index) => {
                                if (
                                    link.label.includes('Previous') ||
                                    link.label.includes('Next')
                                ) {
                                    return;
                                }

                                if (link.url === null) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url}
                                            isActive={link.active}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href={paginatedData.links.next}
                                    className={
                                        !paginatedData.links.next
                                            ? 'pointer-events-none opacity-50'
                                            : undefined
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
