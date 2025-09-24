<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AccessControlController;

Route::middleware(['auth', 'role:Super Admin'])->prefix('admin')->group(function () {
    Route::get('access-control', [AccessControlController::class, 'index'])->name('admin.access-control');
    Route::post('roles', [AccessControlController::class, 'storeRole'])->name('admin.roles.store');
    Route::post('permissions', [AccessControlController::class, 'storePermission'])->name('admin.permissions.store');
    Route::post('assign-role', [AccessControlController::class, 'assignRoleToUser'])->name('admin.assign-role.store');
});
