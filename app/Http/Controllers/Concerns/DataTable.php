<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait DataTable
{
    /**
     * Build a query for the data table.
     *
     * @param Builder $query
     * @param Request $request
     * @param array $searchableColumns
     * @param array $sortableColumns
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    protected function buildQuery(Builder $query, Request $request, array $searchableColumns = [], array $sortableColumns = [])
    {
        // Handle global search
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function (Builder $q) use ($search, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        // Handle column-specific filters
        if ($request->filled('filters')) {
            $filters = $request->get('filters');
            foreach ($filters as $field => $value) {
                if (!empty($value)) {
                    if (is_array($value)) {
                        // Handle range filters (e.g., for dates or numbers)
                        if (isset($value['start']) && isset($value['end'])) {
                            $query->whereBetween($field, [$value['start'], $value['end']]);
                        }
                    } else {
                        // Handle exact match or like filters
                        $query->where($field, 'like', "%{$value}%");
                    }
                }
            }
        }

        // Handle sorting
        $sortField = $request->get('sort_field', $query->getModel()->getKeyName());
        $sortDirection = $request->get('sort_direction', 'asc');

        if (!empty($sortableColumns) && in_array($sortField, $sortableColumns)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            // Default sort if no valid field is provided
            $query->orderBy($query->getModel()->getKeyName(), 'asc');
        }

        // Handle pagination
        $perPage = $request->get('per_page', 10);
        $paginator = $query->paginate($perPage);

        // Append query strings to pagination links
        $paginator->appends($request->query());

        return $paginator;
    }

    /**
     * Get the filter parameters from the request.
     *
     * @param Request $request
     * @return array
     */
    protected function getFilterParams(Request $request): array
    {
        return [
            'search' => $request->get('search', ''),
            'filters' => $request->get('filters', []),
            'sort_field' => $request->get('sort_field', 'id'),
            'sort_direction' => $request->get('sort_direction', 'asc'),
            'per_page' => $request->get('per_page', 10),
        ];
    }
}