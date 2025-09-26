<?php

use App\Http\Controllers\Admin\AdminDashboardIndexController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\Dashboard\DashboardIndexController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('dashboard', DashboardIndexController::class)->name('dashboard');

Route::resource('/admin/users', AdminUsersController::class)->names('admin.users');
Route::post('/admin/users/bulk-delete', [AdminUsersController::class, 'bulkDelete'])->name('admin.users.bulk-delete');

Route::get('admin', AdminDashboardIndexController::class)->name('admin');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
