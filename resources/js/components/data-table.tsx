import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Paginator } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react';
import { parse } from 'node:path';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pagination?: Paginator<TData>;
    filters?: {
        search: string;
        sort_field: string;
        sort_direction: string;
        per_page: number;
    };
    enableSelection?: boolean;
    onBulkAction?: (action: string, selectedIds: number[]) => void;
}

export function DataTable<TData extends { id: number }, TValue>({
    columns,
    data,
    pagination,
    filters,
    enableSelection = false,
    onBulkAction,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>(
        filters?.sort_field
            ? [
                  {
                      id: filters.sort_field,
                      desc: filters.sort_direction === 'desc',
                  },
              ]
            : [],
    );
    const [rowSelection, setRowSelection] = useState({});
    const [searchValue, setSearchValue] = useState(filters?.search || '');

    // Add checkbox column if selection is enabled

    const tableColumns = enableSelection
        ? [
              {
                  id: 'select',
                  header: ({ table }) => (
                      <Checkbox
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(value) =>
                              table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Select all"
                      />
                  ),
                  cell: ({ row }) => (
                      <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                          }
                          aria-label="Select row"
                      />
                  ),
                  enableSorting: false,
                  enableHiding: false,
              },
              ...columns,
          ]
        : columns;

    const table = useReactTable({
        data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination ? undefined : getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
        manualSorting: !!pagination, // Use server-side sorting if pagination provided
        enableRowSelection: enableSelection,
    });

    const handleSortingChange = (columnId: string) => {
        if (!pagination) {
            // Client-side sorting - let React Table handle it
            const currentSort = sorting.find((s) => s.id === columnId);
            const newSorting: SortingState = currentSort
                ? [{ id: columnId, desc: !currentSort.desc }]
                : [{ id: columnId, desc: false }];
            setSorting(newSorting);
            return;
        }

        // Server-side sorting - update URL params
        const currentSort = sorting.find((s) => s.id === columnId);
        let newDirection = 'asc';

        if (currentSort) {
            newDirection = currentSort.desc ? 'asc' : 'desc';
        }

        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                sort_field: columnId,
                sort_direction: newDirection,
                page: 1, // Reset to first page when sorting
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);

        if (!pagination) {
            // Client-side search would need additional implementation
            return;
        }

        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                search: value,
                page: 1, // Reset to first page when searching
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const handlePerPageChange = (value: string) => {
        if (!pagination) return;

        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                per_page: value,
                page: 1, // Reset to first page when changing per page
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const handlePageChange = (page: number) => {
        if (!pagination) return;

        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                page,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    const getSelectedIds = (): number[] => {
        return table
            .getFilteredSelectedRowModel()
            .rows.map((row) => (row.original as TData).id);
    };

    const handleBulkAction = (action: string) => {
        const selectedIds = getSelectedIds();
        if (selectedIds.length === 0) {
            // Simple alert instead of toast for now
            alert('Please select at least one item');
            return;
        }

        if (onBulkAction) {
            onBulkAction(action, selectedIds);
        } else {
            // Default bulk delete action
            router.post('/admin/users/bulk-delete', {
                ids: selectedIds,
            });
        }
    };

    const selectedCount = table.getFilteredSelectedRowModel().rows.length;

    return (
        <div className="space-y-4">
            {/* Search and Actions Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>

                    {pagination && (
                        <Select
                            value={filters?.per_page?.toString() || '10'}
                            onValueChange={handlePerPageChange}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Bulk Actions */}
                {enableSelection && selectedCount > 0 && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                            {selectedCount} selected
                        </span>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Selected
                        </Button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'flex cursor-pointer items-center justify-between space-x-1 rounded p-1 select-none hover:bg-muted/50'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    header.column.getCanSort() &&
                                                    handleSortingChange(
                                                        header.id,
                                                    )
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext(),
                                                )}
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        <ChevronUp
                                                            className={`h-3 w-3 ${
                                                                header.column.getIsSorted() ===
                                                                'asc'
                                                                    ? 'text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        />
                                                        <ChevronDown
                                                            className={`-mt-1 h-3 w-3 ${
                                                                header.column.getIsSorted() ===
                                                                'desc'
                                                                    ? 'text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
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
                                    colSpan={tableColumns.length}
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
            {pagination && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} results
                    </div>

                    <div className="flex items-center space-x-2">
                        {pagination.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild
                                disabled={!link.url}
                            >
                                <Link
                                    href={link.url || ''}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
