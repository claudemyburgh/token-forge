<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\DataTable;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminUsersController extends Controller implements HasMiddleware
{
    use DataTable;
    public static function middleware()
    {
        return ['auth', 'verified', 'role:Super Admin'];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        $searchableColumns = ['name', 'email'];
        $sortableColumns = ['id', 'name', 'email', 'created_at', 'email_verified_at'];

        $users = $this->buildQuery($query, $request, $searchableColumns, $sortableColumns);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $this->getFilterParams($request)
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id'
        ]);

        // Prevent deleting current user
        $userIds = array_filter($request->ids, function ($id) {
            return $id !== auth()->id();
        });

        User::whereIn('id', $userIds)->delete();

        return redirect()->back()->with('success', 'Users deleted successfully.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|string|in:delete,activate,deactivate',
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id'
        ]);

        $userIds = array_filter($request->ids, function ($id) {
            return $id !== auth()->id();
        });

        switch ($request->action) {
            case 'delete':
                User::whereIn('id', $userIds)->delete();
                $message = 'Users deleted successfully.';
                break;
            default:
//            case 'activate':
//                User::whereIn('id', $userIds)->update(['is_active' => true]);
//                $message = 'Users activated successfully.';
//                break;
//            case 'deactivate':
//                User::whereIn('id', $userIds)->update(['is_active' => false]);
//                $message = 'Users deactivated successfully.';
//                break;
//            default:
                return redirect()->back()->with('error', 'Invalid action.');
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Password::defaults()],
            'email_verified_at' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => $request->email_verified_at,
        ]);

        return redirect()->route('admin.users.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('admin/users/show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', compact('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($user->id),
            ],
            'password' => ['nullable', Password::defaults()],
            'email_verified_at' => 'nullable|date',
        ]);


        $data = $request->only('name', 'email', 'email_verified_at');


        // Update password only if provided
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
